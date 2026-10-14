"use client";

import { useCallback, useState } from "react";
import { errorMessage } from "@vol/api-client";
import { api } from "@/lib/api";

const MAX_MB = 10;

/** Uploads a picked file to the API and returns its public URL (or null after reporting an error). */
export function useUpload(onError: (message: string) => void) {
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File | undefined | null, accept: "image" | "document" | "media" = "image") => {
      if (!file) return null;
      const ok =
        accept === "image"
          ? file.type.startsWith("image/")
          : accept === "document"
            ? file.type.startsWith("image/") || file.type === "application/pdf"
            : file.type.startsWith("image/") || file.type.startsWith("video/") || file.type === "application/pdf";
      if (!ok) {
        onError(accept === "image" ? "Choose an image file (PNG, JPG, WEBP or GIF)." : "Choose a PDF or image file.");
        return null;
      }
      if (file.size > MAX_MB * 1024 * 1024 && accept !== "media") {
        onError(`Files must be ${MAX_MB}MB or smaller.`);
        return null;
      }
      setUploading(true);
      try {
        return (await api.upload(file)).url;
      } catch (err) {
        onError(errorMessage(err));
        return null;
      } finally {
        setUploading(false);
      }
    },
    [onError],
  );

  return { upload, uploading };
}
