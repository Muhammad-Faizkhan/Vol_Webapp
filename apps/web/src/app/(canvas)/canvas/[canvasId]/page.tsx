"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { errorMessage, type CanvasDetail, type CanvasDocument, type CanvasObject, type Paged, type Product } from "@vol/api-client";
import { useApiQuery, useAuth, useInvalidate, withQuery } from "@vol/api-client/react";
import { CanvasEditor, renderThumbnail, type CanvasEditorHandle } from "@/components/canvas/CanvasEditor";
import { FullPageSpinner } from "@/components/auth/RequireAuth";
import { CanvasMissing } from "@/components/canvas/CanvasMissing";
import { useToast } from "@/components/ui/Toast";
import { Avatar, UserImage } from "@/components/ui/UserImage";
import { api } from "@/lib/api";
import { useUpload } from "@/lib/useUpload";

type SaveState = "saved" | "saving" | "unsaved" | "error";
const SAVE_LABEL: Record<SaveState, string> = { saved: "Synced", saving: "Saving…", unsaved: "Unsaved changes", error: "Not saved" };
const THUMBNAIL_EVERY_MS = 30_000;

export default function CanvasEditorPage() {
  const { canvasId } = useParams<{ canvasId: string }>();
  const { data: canvas, error, mutate } = useApiQuery<CanvasDetail>(`/canvases/${canvasId}`);

  if (error) return <CanvasMissing message={errorMessage(error)} />;
  if (!canvas) return <FullPageSpinner />;
  return <Editor key={canvas.id} canvas={canvas} onRefresh={() => mutate()} />;
}

function Editor({ canvas, onRefresh }: { canvas: CanvasDetail; onRefresh: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const invalidate = useInvalidate();
  const readOnly = !canvas.canEdit;
  const handle = useRef<CanvasEditorHandle | null>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const { upload } = useUpload((m) => toast(m, "error"));

  // ─── Saving ────────────────────────────────────────────────────────────────
  const [doc, setDoc] = useState<CanvasDocument>(canvas.data?.objects ? canvas.data : { objects: [] });
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const pending = useRef<CanvasDocument | null>(null);
  const lastSave = useRef(0);
  const lastThumb = useRef(0);
  const linkedProducts = useRef(new Set(canvas.products.map((p) => p.id)));

  useEffect(() => {
    lastSave.current = Date.now();
  }, []);

  /** Keeps the canvas's product links (the "4 Products" counts) in step with what's on the canvas. */
  async function syncProducts(next: CanvasDocument) {
    const onCanvas = new Set(next.objects.filter((o) => o.type === "product" && o.productId).map((o) => o.productId!));
    const linked = linkedProducts.current;
    const added = [...onCanvas].filter((id) => !linked.has(id));
    const removed = [...linked].filter((id) => !onCanvas.has(id));
    for (const id of added) await api.post(`/canvases/${canvas.id}/products`, { productId: id }).catch(() => {});
    for (const id of removed) await api.del(`/canvases/${canvas.id}/products/${id}`).catch(() => {});
    if (added.length || removed.length) {
      linkedProducts.current = onCanvas;
      onRefresh();
    }
  }

  async function saveThumbnail() {
    lastThumb.current = Date.now();
    const blob = await renderThumbnail(handle.current?.svg() ?? null);
    if (!blob) return;
    try {
      const { url } = await api.upload(new File([blob], "thumbnail.png", { type: "image/png" }));
      await api.patch(`/canvases/${canvas.id}`, { thumbnailUrl: url });
    } catch {
      // A missing thumbnail isn't worth interrupting the user for.
    }
  }

  const flush = useCallback(async () => {
    const next = pending.current;
    if (!next || readOnly) return;
    pending.current = null;
    setSaveState("saving");
    try {
      await api.put(`/canvases/${canvas.id}/data`, { data: next });
      lastSave.current = Date.now();
      setSaveState(pending.current ? "unsaved" : "saved");
      await syncProducts(next);
      if (Date.now() - lastThumb.current > THUMBNAIL_EVERY_MS) void saveThumbnail();
    } catch (err) {
      pending.current ??= next;
      setSaveState("error");
      toast(errorMessage(err), "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas.id, readOnly]);

  // Save shortly after edits stop, and at least every `autosaveSeconds` while editing continuously.
  useEffect(() => {
    if (saveState !== "unsaved") return;
    const quiet = setTimeout(flush, 1500);
    const due = lastSave.current + canvas.autosaveSeconds * 1000 - Date.now();
    const forced = setTimeout(flush, Math.max(0, due));
    return () => {
      clearTimeout(quiet);
      clearTimeout(forced);
    };
  }, [doc, saveState, flush, canvas.autosaveSeconds]);

  // Don't lose the last edits when leaving the page.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (pending.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      void flush();
    };
  }, [flush]);

  const onChange = useCallback((next: CanvasDocument) => {
    pending.current = next;
    setDoc(next);
    setSaveState("unsaved");
  }, []);

  // ─── Title, visibility, delete ─────────────────────────────────────────────
  const [title, setTitle] = useState(canvas.title);
  const [visibility, setVisibility] = useState(canvas.visibility);
  const [menuOpen, setMenuOpen] = useState(false);

  async function rename() {
    const next = title.trim();
    if (!next || next === canvas.title) return setTitle(canvas.title);
    try {
      await api.patch(`/canvases/${canvas.id}`, { title: next });
      await invalidate("/canvases", "/workspaces");
    } catch (err) {
      setTitle(canvas.title);
      toast(errorMessage(err), "error");
    }
  }

  async function toggleVisibility() {
    const next = visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    try {
      await api.patch(`/canvases/${canvas.id}`, { visibility: next });
      setVisibility(next);
      toast(next === "PUBLIC" ? "Canvas is now public" : "Canvas is now private");
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  async function deleteCanvas() {
    if (!window.confirm(`Delete "${canvas.title}"? This can't be undone.`)) return;
    try {
      await api.del(`/canvases/${canvas.id}`);
      pending.current = null;
      await invalidate("/canvases", "/workspaces");
      router.push(`/workspaces/${canvas.workspace.id}/canvases`);
    } catch (err) {
      toast(errorMessage(err), "error");
    }
  }

  // ─── Selection & products ──────────────────────────────────────────────────
  const [selected, setSelected] = useState<CanvasObject | null>(null);
  const selectedProductId = selected?.type === "product" ? selected.productId : null;
  const { data: selectedProduct } = useApiQuery<Product>(selectedProductId ? `/products/${selectedProductId}` : null);

  const quantities = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of doc.objects) if (o.type === "product" && o.productId) counts.set(o.productId, (counts.get(o.productId) ?? 0) + 1);
    return counts;
  }, [doc]);
  const onCanvas = canvas.products.filter((p) => quantities.has(p.id));

  const [search, setSearch] = useState("");
  const { data: found } = useApiQuery<Paged<Product>>(!readOnly ? withQuery("/products", { q: search.trim() || undefined, limit: 6 }) : null);

  // "Add to a canvas" on a product page lands here with ?addProduct=<id>; place it once the editor is ready.
  useEffect(() => {
    const productId = new URLSearchParams(window.location.search).get("addProduct");
    if (!productId || readOnly) return;
    let cancelled = false;
    (async () => {
      try {
        const product = await api.get<Product>(`/products/${productId}`);
        if (cancelled) return;
        // The editor registers its handle on first render; give it a moment if it isn't there yet.
        for (let i = 0; i < 20 && !handle.current; i++) await new Promise((r) => setTimeout(r, 50));
        handle.current?.addProduct(product);
        toast(`Added ${product.name}`);
      } catch (err) {
        toast(errorMessage(err), "error");
      } finally {
        router.replace(`/canvas/${canvas.id}`);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canDelete = canvas.myRole === "OWNER" || canvas.myRole === "ADMIN" || canvas.createdBy.id === user?.id;

  return (
    <div className="flex h-dvh w-full flex-col bg-white dark:bg-dak-bg">
      <input
        ref={imageInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const url = await upload(e.target.files?.[0]);
          if (url) handle.current?.addImage(url);
          e.target.value = "";
        }}
      />
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-light-border bg-white px-4 py-2 dark:border-dak-border dark:bg-dak-bg sm:flex-nowrap sm:px-6 sm:py-0">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={canvas.myRole ? `/workspaces/${canvas.workspace.id}/canvases` : "/explore"}
            aria-label="Back"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f2f2f3] text-auth-navy dark:bg-dak-cta dark:text-white"
          >
            <Image src="/icons/arrow-narrow-right.svg" alt="" width={18} height={18} className="-scale-y-100 rotate-180 dark:invert" />
          </Link>
          <span className="hidden truncate text-base text-auth-navy dark:text-dak-heading sm:inline">{canvas.workspace.name}</span>
          <span className="text-base text-auth-navy dark:text-dak-heading">/</span>
          {readOnly ? (
            <span className="truncate text-base font-medium text-auth-navy dark:text-dak-heading">{canvas.title}</span>
          ) : (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={rename}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              aria-label="Canvas title"
              className="min-w-0 max-w-[260px] truncate rounded bg-transparent px-1 text-base font-medium text-auth-navy hover:bg-auth-navy/5 focus:bg-auth-navy/5 focus:outline-none dark:text-dak-heading"
            />
          )}
        </div>

        <div className="hidden items-center gap-2 text-base font-medium text-auth-navy dark:text-dak-body md:flex">
          <Avatar src={canvas.createdBy.avatarUrl} name={canvas.createdBy.name} size={32} />
          {readOnly ? `Shared by ${canvas.createdBy.name}` : `Created by ${canvas.createdBy.name}`}
        </div>

        <div className="relative flex shrink-0 items-center gap-3">
          <span className="rounded-lg bg-[#efefef] px-3 py-1.5 text-sm font-semibold text-auth-navy dark:bg-dak-surface dark:text-dak-heading">
            {readOnly ? "View only" : SAVE_LABEL[saveState]}
          </span>
          {!readOnly && (
            <button
              type="button"
              onClick={toggleVisibility}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                visibility === "PUBLIC" ? "bg-[rgba(52,168,83,0.15)] text-[#34a853]" : "bg-[rgba(2,2,4,0.1)] text-[#020204] dark:bg-dak-cta/10 dark:text-dak-heading"
              }`}
              title="Toggle who can see this canvas"
            >
              {visibility === "PUBLIC" ? "Public" : "Private"}
            </button>
          )}
          {canDelete && (
            <>
              <button
                type="button"
                aria-label="Canvas options"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-9 items-center justify-center rounded-lg text-xl leading-none text-auth-navy hover:bg-auth-navy/10 dark:text-dak-heading"
              >
                ⋯
              </button>
              {menuOpen && (
                <>
                  <button type="button" aria-label="Close menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-light-border bg-white shadow-lg dark:border-dak-border dark:bg-dak-surface">
                    <button type="button" onClick={deleteCanvas} className="flex min-h-11 w-full items-center px-4 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                      Delete canvas
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
        <aside className="flex h-[45dvh] min-h-0 w-full shrink-0 flex-col gap-6 overflow-y-auto border-t border-light-border bg-[#d9d9d9] p-6 dark:border-dak-border dark:bg-dak-bg md:h-auto md:w-[400px] md:border-l md:border-t-0">
          {selectedProduct && (
            <div>
              <h3 className="mb-3 text-base font-semibold text-auth-navy dark:text-dak-heading">Selected Product</h3>
              <div className="overflow-hidden rounded-lg border border-light-border bg-[#f8f9ff] dark:border-dak-border dark:bg-dak-surface">
                <div className="relative flex h-[130px] items-center justify-center bg-auth-navy dark:bg-dak-surface">
                  <UserImage src={selectedProduct.images[0]} fallback="/illustrations/auth-placeholder.svg" />
                </div>
                <div className="p-4">
                  <p className="text-base font-semibold text-auth-navy dark:text-dak-heading">{selectedProduct.name}</p>
                  <p className="text-sm text-[#929292] dark:text-dak-muted">By {selectedProduct.business.name}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1 rounded-2xl bg-[#f8f9ff] p-4 dark:bg-dak-surface">
                {(
                  [
                    ["True Size", selectedProduct.size ?? "—"],
                    ["Thickness", selectedProduct.heightMm != null ? `${selectedProduct.heightMm} mm` : "—"],
                    ["Weight", selectedProduct.weightKg != null ? `${selectedProduct.weightKg} kg` : "—"],
                    ["Brand", selectedProduct.brand ?? "—"],
                  ] as const
                ).map(([label, value], i) => (
                  <div key={label} className={`flex justify-between py-2.5 text-sm text-auth-navy dark:text-dak-body ${i !== 3 ? "border-b border-light-border dark:border-dak-border" : ""}`}>
                    <span>{label}</span>
                    <span className="font-medium dark:text-dak-heading">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!readOnly && (
            <div className="overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
              <div className="bg-[#cdced0] px-4 py-3 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading">Add products</div>
              <div className="flex flex-col gap-3 p-4">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search the catalog…"
                  className="h-10 rounded-lg border border-light-border bg-[#f8f9ff] px-3 text-sm text-auth-navy focus:outline-none dark:border-dak-border dark:bg-dak-bg dark:text-dak-heading"
                />
                {found?.items.length === 0 && <p className="text-sm text-[#929292] dark:text-dak-muted">No products found.</p>}
                {found?.items.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handle.current?.addProduct(p)}
                    className="flex items-center gap-3 rounded-xl border border-light-border bg-[#f8f9ff] px-3 py-2 text-left hover:border-dak-cta dark:border-dak-border dark:bg-dak-bg"
                  >
                    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-auth-navy dark:bg-dak-cta">
                      <UserImage src={p.images[0]} fallback="/illustrations/auth-placeholder.svg" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{p.name}</span>
                      <span className="truncate text-xs text-[#929292] dark:text-dak-muted">By {p.business.name}</span>
                    </span>
                    <span className="text-lg text-dak-cta">+</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-light-border bg-white dark:border-dak-border dark:bg-dak-surface">
            <div className="bg-[#cdced0] px-4 py-3 text-sm font-medium text-auth-navy dark:bg-dak-bg dark:text-dak-heading">
              Products on this canvas · {[...quantities.values()].reduce((a, b) => a + b, 0)}
            </div>
            <div className="flex flex-col gap-4 p-4">
              {onCanvas.length === 0 && (
                <p className="text-sm text-[#929292] dark:text-dak-muted">{readOnly ? "No products placed yet." : "Search the catalog above to place products."}</p>
              )}
              {onCanvas.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="flex items-center justify-between rounded-2xl border border-light-border bg-[#f8f9ff] px-4 py-3 dark:border-dak-border dark:bg-dak-bg"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-auth-navy dark:bg-dak-cta">
                      <UserImage src={p.image} fallback="/illustrations/auth-placeholder.svg" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-auth-navy dark:text-dak-heading">{p.name}</span>
                      <span className="truncate text-xs text-[#929292] dark:text-dak-muted">By {p.business.name}</span>
                    </div>
                  </div>
                  <span className="text-sm text-auth-navy dark:text-dak-body">x{quantities.get(p.id)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="relative min-h-0 flex-1">
          <CanvasEditor
            doc={doc}
            readOnly={readOnly}
            authorName={user?.name ?? "Me"}
            onChange={onChange}
            onSelect={setSelected}
            handleRef={(h) => (handle.current = h)}
            onRequestImage={() => imageInput.current?.click()}
            overlay={
              <div className="pointer-events-none absolute bottom-6 right-6 flex items-center gap-2 rounded-lg bg-auth-navy px-4 py-2 text-sm text-white dark:bg-dak-cta">
                <span className="size-2 rounded-full bg-[#22c55e]" />
                {canvas.collaboratorCount} {canvas.collaboratorCount === 1 ? "Collaborator" : "Collaborators"}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
