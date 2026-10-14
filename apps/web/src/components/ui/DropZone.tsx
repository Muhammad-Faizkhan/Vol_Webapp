"use client";

import { useState, type ReactNode } from "react";

/** A button that opens a file picker on click and also accepts a dropped file. */
export function DropZone({
  onFile,
  onClick,
  className = "",
  children,
}: {
  onFile: (file: File) => void;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`${className} ${dragging ? "ring-2 ring-dak-cta" : ""}`}
    >
      {children}
    </button>
  );
}
