"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import type { CanvasDocument, CanvasObject, Product } from "@vol/api-client";

// A small vector editor: everything lives in "world" coordinates and the SVG applies pan + zoom.

export type Tool = "select" | "hand" | "pen" | "rect" | "ellipse" | "text" | "comment" | "image";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const GRID = 68;
const COLORS = ["#2b2b31", "#9436fb", "#34a853", "#ea4335", "#fbbc05", "#4285f4"];
const uid = () => Math.random().toString(36).slice(2, 10);

type Drag =
  | { kind: "pan"; startX: number; startY: number; panX: number; panY: number }
  | { kind: "move"; id: string; startX: number; startY: number; orig: CanvasObject }
  | { kind: "resize"; id: string; startX: number; startY: number; orig: CanvasObject }
  | { kind: "draw"; id: string; startX: number; startY: number };

export type CanvasEditorHandle = {
  addProduct: (product: Pick<Product, "id" | "name" | "images" | "size" | "widthMm" | "lengthMm">) => void;
  addImage: (src: string) => void;
  svg: () => SVGSVGElement | null;
};

type Props = {
  doc: CanvasDocument;
  readOnly: boolean;
  authorName: string;
  maxObjects?: number;
  onChange: (doc: CanvasDocument) => void;
  onSelect?: (object: CanvasObject | null) => void;
  /** Lets the page add products/images from outside the canvas. */
  handleRef?: (handle: CanvasEditorHandle) => void;
  onRequestImage?: () => void;
  overlay?: ReactNode;
};

export function CanvasEditor({ doc, readOnly, authorName, maxObjects = 2000, onChange, onSelect, handleRef, onRequestImage, overlay }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [objects, setObjects] = useState<CanvasObject[]>(doc.objects ?? []);
  const [view, setView] = useState(doc.viewport ?? { x: 80, y: 80, zoom: 0.8 });
  const [tool, setTool] = useState<Tool>(readOnly ? "hand" : "select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const drag = useRef<Drag | null>(null);
  const history = useRef<{ past: CanvasObject[][]; future: CanvasObject[][] }>({ past: [], future: [] });

  const selected = useMemo(() => objects.find((o) => o.id === selectedId) ?? null, [objects, selectedId]);
  useEffect(() => onSelect?.(selected), [selected, onSelect]);

  /** Applies a change, records it for undo, and reports the new document. */
  const commit = useCallback(
    (next: CanvasObject[], record = true) => {
      if (next.length > maxObjects) return;
      if (record) {
        history.current.past.push(objects);
        if (history.current.past.length > 100) history.current.past.shift();
        history.current.future = [];
      }
      setObjects(next);
      onChange({ objects: next, viewport: view });
    },
    [objects, onChange, view, maxObjects],
  );

  const update = useCallback(
    (id: string, patch: Partial<CanvasObject>, record = true) => commit(objects.map((o) => (o.id === id ? { ...o, ...patch } : o)), record),
    [objects, commit],
  );

  const remove = useCallback(
    (id: string) => {
      commit(objects.filter((o) => o.id !== id));
      setSelectedId(null);
      setEditingId(null);
    },
    [objects, commit],
  );

  const undo = useCallback(() => {
    const prev = history.current.past.pop();
    if (!prev) return;
    history.current.future.push(objects);
    setObjects(prev);
    onChange({ objects: prev, viewport: view });
  }, [objects, onChange, view]);

  const redo = useCallback(() => {
    const next = history.current.future.pop();
    if (!next) return;
    history.current.past.push(objects);
    setObjects(next);
    onChange({ objects: next, viewport: view });
  }, [objects, onChange, view]);

  /** Center of the visible area in world coordinates (where new things are placed). */
  const viewCenter = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 800;
    const h = rect?.height ?? 600;
    return { x: (w / 2 - view.x) / view.zoom, y: (h / 2 - view.y) / view.zoom };
  }, [view]);

  useEffect(() => {
    handleRef?.({
      addProduct(product) {
        const c = viewCenter();
        // True scale: 1 world unit = 1 mm / 2 so typical tiles fit on screen.
        const w = Math.max(80, Math.min(600, (product.widthMm ?? 300) / 2));
        const h = Math.max(80, Math.min(600, (product.lengthMm ?? 300) / 2));
        const object: CanvasObject = {
          id: uid(),
          type: "product",
          x: c.x - w / 2,
          y: c.y - h / 2,
          w,
          h,
          productId: product.id,
          text: product.size ? `${product.name} · ${product.size}` : product.name,
          src: product.images[0],
        };
        commit([...objects, object]);
        setSelectedId(object.id);
        setTool("select");
      },
      addImage(src) {
        const c = viewCenter();
        const object: CanvasObject = { id: uid(), type: "image", x: c.x - 150, y: c.y - 100, w: 300, h: 200, src };
        commit([...objects, object]);
        setSelectedId(object.id);
        setTool("select");
      },
      svg: () => svgRef.current,
    });
  }, [handleRef, objects, commit, viewCenter]);

  const toWorld = (e: { clientX: number; clientY: number }) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left - view.x) / view.zoom, y: (e.clientY - rect.top - view.y) / view.zoom };
  };

  function onPointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (e.button === 1 || e.button === 2) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = toWorld(e);
    const targetId = (e.target as Element).closest("[data-id]")?.getAttribute("data-id") ?? null;
    const handle = (e.target as Element).getAttribute("data-handle");

    if (readOnly) {
      // Viewers can pan and inspect (e.g. select a product to see its details), not edit.
      setSelectedId(targetId);
      drag.current = { kind: "pan", startX: e.clientX, startY: e.clientY, panX: view.x, panY: view.y };
      return;
    }
    if (tool === "hand") {
      drag.current = { kind: "pan", startX: e.clientX, startY: e.clientY, panX: view.x, panY: view.y };
      return;
    }
    if (tool === "select") {
      setEditingId(null);
      if (handle && selected) {
        drag.current = { kind: "resize", id: selected.id, startX: p.x, startY: p.y, orig: selected };
        history.current.past.push(objects);
      } else if (targetId) {
        setSelectedId(targetId);
        const orig = objects.find((o) => o.id === targetId)!;
        drag.current = { kind: "move", id: targetId, startX: p.x, startY: p.y, orig };
        history.current.past.push(objects);
      } else {
        setSelectedId(null);
        drag.current = { kind: "pan", startX: e.clientX, startY: e.clientY, panX: view.x, panY: view.y };
      }
      return;
    }
    if (tool === "image") {
      onRequestImage?.();
      return;
    }
    if (tool === "text" || tool === "comment") {
      const object: CanvasObject =
        tool === "text"
          ? { id: uid(), type: "text", x: p.x, y: p.y, text: "Text", color, fontSize: 24 }
          : { id: uid(), type: "comment", x: p.x, y: p.y, w: 180, h: 110, text: "", author: authorName };
      commit([...objects, object]);
      setSelectedId(object.id);
      setEditingId(object.id);
      setTool("select");
      return;
    }
    // Drawing tools create the object now and grow it while dragging.
    const id = uid();
    const object: CanvasObject =
      tool === "pen"
        ? { id, type: "path", x: 0, y: 0, points: [[p.x, p.y]], color, strokeWidth: 3 }
        : { id, type: tool, x: p.x, y: p.y, w: 1, h: 1, color, fill: "transparent", strokeWidth: 2 };
    history.current.past.push(objects);
    history.current.future = [];
    setObjects([...objects, object]);
    drag.current = { kind: "draw", id, startX: p.x, startY: p.y };
  }

  function onPointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const d = drag.current;
    if (!d) return;
    if (d.kind === "pan") {
      setView((v) => ({ ...v, x: d.panX + (e.clientX - d.startX), y: d.panY + (e.clientY - d.startY) }));
      return;
    }
    const p = toWorld(e);
    const dx = p.x - d.startX;
    const dy = p.y - d.startY;
    setObjects((all) =>
      all.map((o) => {
        if (o.id !== d.id) return o;
        if (d.kind === "move") {
          if (o.type === "path") return { ...o, points: d.orig.points!.map(([x, y]) => [x + dx, y + dy] as [number, number]) };
          return { ...o, x: d.orig.x + dx, y: d.orig.y + dy };
        }
        if (d.kind === "resize") return { ...o, w: Math.max(10, (d.orig.w ?? 0) + dx), h: Math.max(10, (d.orig.h ?? 0) + dy) };
        if (o.type === "path") return { ...o, points: [...(o.points ?? []), [p.x, p.y]] };
        return { ...o, x: Math.min(d.startX, p.x), y: Math.min(d.startY, p.y), w: Math.abs(dx), h: Math.abs(dy) };
      }),
    );
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.kind === "pan") {
      onChange({ objects, viewport: view });
      return;
    }
    let next = objects;
    if (d.kind === "draw") {
      const o = objects.find((x) => x.id === d.id);
      // A click without a drag makes a default-sized shape instead of a 1px one.
      if (o && o.type !== "path" && (o.w ?? 0) < 4 && (o.h ?? 0) < 4) {
        next = objects.map((x) => (x.id === d.id ? { ...x, w: 160, h: 110 } : x));
      }
      setSelectedId(d.id);
    }
    if (d.kind === "move" && d.orig.x === objects.find((o) => o.id === d.id)?.x && d.orig.y === objects.find((o) => o.id === d.id)?.y && d.orig.type !== "path") {
      history.current.past.pop(); // a plain click, nothing moved
      return;
    }
    commit(next, false);
  }

  function onWheel(e: React.WheelEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) {
      const factor = Math.exp(-e.deltaY * 0.002);
      setView((v) => {
        const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        return { zoom, x: mx - ((mx - v.x) * zoom) / v.zoom, y: my - ((my - v.y) * zoom) / v.zoom };
      });
    } else {
      setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
    }
  }

  // Keyboard shortcuts (ignored while typing in an input).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (typing) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (readOnly) return;
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (!readOnly) redo();
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedId && !readOnly) {
        e.preventDefault();
        remove(selectedId);
      } else if (e.key === "Escape") {
        setSelectedId(null);
        setEditingId(null);
      } else if (!mod && !readOnly) {
        const map: Record<string, Tool> = { v: "select", h: "hand", p: "pen", r: "rect", o: "ellipse", t: "text", c: "comment" };
        const next = map[e.key.toLowerCase()];
        if (next) setTool(next);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [readOnly, selectedId, remove, undo, redo]);

  const zoomBy = (factor: number) =>
    setView((v) => {
      const rect = svgRef.current?.getBoundingClientRect();
      const mx = (rect?.width ?? 800) / 2;
      const my = (rect?.height ?? 600) / 2;
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
      return { zoom, x: mx - ((mx - v.x) * zoom) / v.zoom, y: my - ((my - v.y) * zoom) / v.zoom };
    });

  /** Zooms so every object is visible. */
  const fit = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || !objects.length) return setView({ x: 80, y: 80, zoom: 0.8 });
    const xs: number[] = [];
    const ys: number[] = [];
    for (const o of objects) {
      if (o.points) o.points.forEach(([x, y]) => (xs.push(x), ys.push(y)));
      else {
        xs.push(o.x, o.x + (o.w ?? 120));
        ys.push(o.y, o.y + (o.h ?? 30));
      }
    }
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min((rect.width - 120) / (maxX - minX || 1), (rect.height - 120) / (maxY - minY || 1))));
    setView({ zoom, x: (rect.width - (maxX - minX) * zoom) / 2 - minX * zoom, y: (rect.height - (maxY - minY) * zoom) / 2 - minY * zoom });
  };

  const editing = objects.find((o) => o.id === editingId);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f2f0ec] dark:bg-[#1a1a1d]">
      <svg
        ref={svgRef}
        role="application"
        aria-label="Canvas"
        className={`h-full w-full select-none ${tool === "hand" || readOnly ? "cursor-grab" : tool === "select" ? "cursor-default" : "cursor-crosshair"}`}
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onDoubleClick={(e) => {
          const id = (e.target as Element).closest("[data-id]")?.getAttribute("data-id");
          const o = objects.find((x) => x.id === id);
          if (!readOnly && o && (o.type === "text" || o.type === "comment")) setEditingId(o.id);
        }}
      >
        <defs>
          <pattern id="grid" width={GRID} height={GRID} patternUnits="userSpaceOnUse">
            <path d={`M ${GRID} 0 L 0 0 0 ${GRID}`} fill="none" stroke="currentColor" strokeWidth="1" className="text-[#e3e0da] dark:text-[#2b2b31]" />
          </pattern>
        </defs>
        <g transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`}>
          <rect x={-5000} y={-5000} width={10000} height={10000} fill="url(#grid)" pointerEvents="none" />
          {objects.map((o) => (
            <ObjectShape key={o.id} o={o} />
          ))}
          {selected && !readOnly && <SelectionBox o={selected} zoom={view.zoom} />}
        </g>
      </svg>

      {editing && (
        <TextEditor
          object={editing}
          view={view}
          onDone={(text) => {
            setEditingId(null);
            if (text.trim() === "" && editing.type === "text") remove(editing.id);
            else if (text !== editing.text) update(editing.id, { text });
          }}
        />
      )}

      {!readOnly && (
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={(c) => {
            setColor(c);
            if (selected && selected.type !== "product" && selected.type !== "image" && selected.type !== "comment") update(selected.id, { color: c });
          }}
          onUndo={undo}
          onRedo={redo}
          onImage={onRequestImage}
        />
      )}

      <div className="absolute bottom-6 left-6 flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-sm text-auth-navy shadow-[0px_1px_3px_rgba(0,0,0,0.1)] dark:bg-dak-surface dark:text-dak-heading">
        <button type="button" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.2)} className="flex size-7 items-center justify-center rounded hover:bg-auth-navy/10">
          −
        </button>
        <span className="w-12 text-center tabular-nums">{Math.round(view.zoom * 100)}%</span>
        <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1.2)} className="flex size-7 items-center justify-center rounded hover:bg-auth-navy/10">
          +
        </button>
        <span className="mx-1 text-light-border">|</span>
        <button type="button" onClick={fit} className="rounded px-2 py-1 hover:bg-auth-navy/10">
          Fit
        </button>
      </div>
      {overlay}
    </div>
  );
}

function ObjectShape({ o }: { o: CanvasObject }) {
  const stroke = o.color ?? "#2b2b31";
  switch (o.type) {
    case "rect":
      return <rect data-id={o.id} x={o.x} y={o.y} width={o.w} height={o.h} rx={4} fill={o.fill ?? "transparent"} stroke={stroke} strokeWidth={o.strokeWidth ?? 2} pointerEvents="all" />;
    case "ellipse":
      return (
        <ellipse
          data-id={o.id}
          cx={o.x + (o.w ?? 0) / 2}
          cy={o.y + (o.h ?? 0) / 2}
          rx={(o.w ?? 0) / 2}
          ry={(o.h ?? 0) / 2}
          fill={o.fill ?? "transparent"}
          stroke={stroke}
          strokeWidth={o.strokeWidth ?? 2}
          pointerEvents="all"
        />
      );
    case "path":
      return (
        <polyline
          data-id={o.id}
          points={(o.points ?? []).map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={stroke}
          strokeWidth={o.strokeWidth ?? 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pointerEvents="stroke"
        />
      );
    case "text":
      return (
        <text data-id={o.id} x={o.x} y={o.y} fill={stroke} fontSize={o.fontSize ?? 24} fontFamily="Inter, sans-serif" dominantBaseline="hanging">
          {(o.text ?? "").split("\n").map((line, i) => (
            <tspan key={i} x={o.x} dy={i === 0 ? 0 : (o.fontSize ?? 24) * 1.25}>
              {line || " "}
            </tspan>
          ))}
        </text>
      );
    case "comment":
      return (
        <g data-id={o.id}>
          <rect x={o.x} y={o.y} width={o.w ?? 180} height={o.h ?? 110} fill="#f4f4f4" stroke="#80939e" rx={6} />
          <foreignObject x={o.x} y={o.y} width={o.w ?? 180} height={o.h ?? 110} pointerEvents="none">
            <div className="h-full overflow-hidden p-3 font-sans text-[#2b2b31]">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide">Note - {o.author ?? "Anonymous"}</p>
              <p className="whitespace-pre-wrap text-xs leading-snug">{o.text || "Double-click to write a note"}</p>
            </div>
          </foreignObject>
        </g>
      );
    case "image":
      return <image data-id={o.id} href={o.src} x={o.x} y={o.y} width={o.w} height={o.h} preserveAspectRatio="xMidYMid slice" />;
    case "product":
      return (
        <g data-id={o.id}>
          <rect x={o.x} y={o.y} width={o.w} height={o.h} fill="#e3e3e3" stroke="#2b2b31" strokeWidth={1.5} />
          {o.src && <image href={o.src} x={o.x} y={o.y} width={o.w} height={o.h} preserveAspectRatio="xMidYMid slice" opacity={0.9} />}
          <foreignObject x={o.x} y={o.y + (o.h ?? 0) + 6} width={Math.max(o.w ?? 0, 200)} height={28} pointerEvents="none">
            <span className="inline-block max-w-full truncate rounded bg-[#2b2b31] px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-wide text-white">
              {o.text}
            </span>
          </foreignObject>
        </g>
      );
    default:
      return null;
  }
}

function SelectionBox({ o, zoom }: { o: CanvasObject; zoom: number }) {
  let x = o.x;
  let y = o.y;
  let w = o.w ?? 0;
  let h = o.h ?? 0;
  if (o.type === "path" && o.points?.length) {
    const xs = o.points.map((p) => p[0]);
    const ys = o.points.map((p) => p[1]);
    x = Math.min(...xs);
    y = Math.min(...ys);
    w = Math.max(...xs) - x;
    h = Math.max(...ys) - y;
  }
  if (o.type === "text") {
    w = Math.max(40, (o.text?.length ?? 4) * (o.fontSize ?? 24) * 0.55);
    h = (o.fontSize ?? 24) * 1.3 * Math.max(1, o.text?.split("\n").length ?? 1);
  }
  const pad = 4 / zoom;
  const size = 10 / zoom;
  const resizable = o.type !== "path" && o.type !== "text";
  return (
    <g pointerEvents="none">
      <rect x={x - pad} y={y - pad} width={w + pad * 2} height={h + pad * 2} fill="none" stroke="#9436fb" strokeWidth={1.5 / zoom} strokeDasharray={`${4 / zoom} ${3 / zoom}`} />
      {resizable && (
        <rect data-handle="se" x={x + w - size / 2} y={y + h - size / 2} width={size} height={size} fill="#fff" stroke="#9436fb" strokeWidth={1.5 / zoom} pointerEvents="all" className="cursor-nwse-resize" />
      )}
    </g>
  );
}

function TextEditor({ object, view, onDone }: { object: CanvasObject; view: { x: number; y: number; zoom: number }; onDone: (text: string) => void }) {
  const [value, setValue] = useState(object.text ?? "");
  const isComment = object.type === "comment";
  return (
    <textarea
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onDone(value)}
      onKeyDown={(e) => {
        if (e.key === "Escape" || (e.key === "Enter" && (e.metaKey || e.ctrlKey))) onDone(value);
      }}
      placeholder={isComment ? "Write a note…" : "Text"}
      className="absolute z-10 resize rounded border-2 border-dak-cta bg-white/95 p-2 font-sans text-[#2b2b31] shadow-lg focus:outline-none"
      style={{
        left: view.x + object.x * view.zoom,
        top: view.y + (object.y + (isComment ? 24 : 0)) * view.zoom,
        width: Math.max(160, (object.w ?? 240) * view.zoom),
        minHeight: 60,
        fontSize: isComment ? 13 : Math.max(12, (object.fontSize ?? 24) * view.zoom),
      }}
    />
  );
}

const TOOLS: { id: Tool; label: string; key: string; icon: ReactNode }[] = [
  { id: "select", label: "Select (V)", key: "V", icon: <path d="M5 3l14 8-6 2-2 6z" /> },
  { id: "hand", label: "Pan (H)", key: "H", icon: <path d="M8 13V5a1.5 1.5 0 013 0v6m0-1V4a1.5 1.5 0 013 0v7m0-4a1.5 1.5 0 013 0v7a6 6 0 01-6 6h-1a6 6 0 01-5-3l-2-4a1.5 1.5 0 012.5-1.5L8 13" /> },
  { id: "pen", label: "Pen (P)", key: "P", icon: <path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3" /> },
  { id: "rect", label: "Rectangle (R)", key: "R", icon: <rect x="4" y="6" width="16" height="12" rx="1" /> },
  { id: "ellipse", label: "Ellipse (O)", key: "O", icon: <ellipse cx="12" cy="12" rx="8" ry="6" /> },
  { id: "text", label: "Text (T)", key: "T", icon: <path d="M5 6V4h14v2M12 4v16M9 20h6" /> },
  { id: "comment", label: "Comment (C)", key: "C", icon: <path d="M4 5h16v11H9l-5 4z" /> },
  { id: "image", label: "Insert image", key: "", icon: <><rect x="4" y="5" width="16" height="14" rx="1" /><path d="M4 16l5-5 4 4 2-2 5 5" /></> },
];

function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  onUndo,
  onRedo,
  onImage,
}: {
  tool: Tool;
  setTool: (t: Tool) => void;
  color: string;
  setColor: (c: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onImage?: () => void;
}) {
  return (
    <div className="absolute left-4 top-1/2 flex w-14 -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl border border-light-border bg-[#f8f9ff] p-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] dark:border-dak-border dark:bg-dak-surface sm:left-10 sm:w-16">
      {TOOLS.map((t, i) => (
        <div key={t.id} className="flex w-full flex-col items-center gap-1.5">
          <button
            type="button"
            title={t.label}
            aria-label={t.label}
            aria-pressed={tool === t.id}
            onClick={() => (t.id === "image" ? onImage?.() : setTool(t.id))}
            className={`flex size-10 items-center justify-center rounded-xl text-auth-navy transition-colors hover:bg-auth-navy/10 dark:text-dak-heading ${tool === t.id ? "bg-auth-navy/20 dark:bg-dak-cta/40" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </svg>
          </button>
          {(i === 1 || i === 4) && <div className="h-px w-8 bg-light-border dark:bg-dak-border" />}
        </div>
      ))}
      <div className="h-px w-8 bg-light-border dark:bg-dak-border" />
      <div className="grid grid-cols-2 gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Color ${c}`}
            onClick={() => setColor(c)}
            className={`size-4 rounded-full ${color === c ? "ring-2 ring-dak-cta ring-offset-1" : ""}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="h-px w-8 bg-light-border dark:bg-dak-border" />
      <button type="button" title="Undo (Ctrl+Z)" aria-label="Undo" onClick={onUndo} className="flex size-8 items-center justify-center rounded-lg text-auth-navy hover:bg-auth-navy/10 dark:text-dak-heading">
        ↶
      </button>
      <button type="button" title="Redo (Ctrl+Shift+Z)" aria-label="Redo" onClick={onRedo} className="flex size-8 items-center justify-center rounded-lg text-auth-navy hover:bg-auth-navy/10 dark:text-dak-heading">
        ↷
      </button>
    </div>
  );
}

/** Renders the canvas to a PNG (shapes and text; external images are skipped by the browser). */
export async function renderThumbnail(svg: SVGSVGElement | null, width = 640, height = 400): Promise<Blob | null> {
  if (!svg) return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const rect = svg.getBoundingClientRect();
  clone.setAttribute("width", String(rect.width));
  clone.setAttribute("height", String(rect.height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.querySelectorAll("foreignObject").forEach((n) => n.remove());
  const data = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data)}`;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  }).catch(() => null);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#f2f0ec";
  ctx.fillRect(0, 0, width, height);
  const scale = Math.max(width / rect.width, height / rect.height);
  ctx.drawImage(img, (width - rect.width * scale) / 2, (height - rect.height * scale) / 2, rect.width * scale, rect.height * scale);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
