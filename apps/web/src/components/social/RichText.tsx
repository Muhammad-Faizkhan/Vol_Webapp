import { Fragment, type ReactNode } from "react";

// Posts support a tiny markdown subset written by the create-post toolbar:
// **bold**, *italic*, "1. " numbered lines and "- " bulleted lines. Rendered as React elements
// (never as HTML), so user text can't inject markup.

export type Format = "bold" | "italic" | "numbered" | "bulleted";

/** Applies a toolbar format to the selected text in a textarea value. */
export function applyFormat(value: string, start: number, end: number, kind: Format) {
  if (kind === "bold" || kind === "italic") {
    const mark = kind === "bold" ? "**" : "*";
    const selected = value.slice(start, end) || (kind === "bold" ? "bold text" : "italic text");
    const next = value.slice(0, start) + mark + selected + mark + value.slice(end);
    return { value: next, selectionStart: start + mark.length, selectionEnd: start + mark.length + selected.length };
  }
  // Lists: prefix every selected line (or the current line).
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", end) === -1 ? value.length : value.indexOf("\n", end);
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const prefixed = lines.map((line, i) => (kind === "numbered" ? `${i + 1}. ` : "- ") + line.replace(/^(\d+\.\s|-\s)/, "")).join("\n");
  const next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  return { value: next, selectionStart: lineStart, selectionEnd: lineStart + prefixed.length };
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(m[1] !== undefined ? <strong key={m.index}>{m[1]}</strong> : <em key={m.index}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={blocks.length} className={`${list.ordered ? "list-decimal" : "list-disc"} pl-6`}>
        {list.items.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </Tag>,
    );
    list = null;
  };
  for (const line of text.split("\n")) {
    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (numbered || bullet) {
      const ordered = !!numbered;
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push((numbered ?? bullet)![1]);
    } else {
      flush();
      blocks.push(<Fragment key={blocks.length}>{line ? <p>{inline(line)}</p> : <br />}</Fragment>);
    }
  }
  flush();
  return <div className={`flex flex-col gap-1 ${className}`}>{blocks}</div>;
}
