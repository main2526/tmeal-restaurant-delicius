"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  MENU_IMAGE_ACCEPT,
  validateMenuImage,
} from "../lib/menu-image-storage";

/* eslint-disable @next/next/no-img-element -- The source can be a local preview or a restaurant-provided URL. */

interface MenuItemImageFieldProps {
  file: File | null;
  imageUrl: string;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
  onUrlChange: (imageUrl: string) => void;
}

export function MenuItemImageField({
  file,
  imageUrl,
  disabled = false,
  onFileChange,
  onUrlChange,
}: MenuItemImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;
    if (!selectedFile) return;

    const validationError = validateMenuImage(selectedFile);
    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    setError(null);
    onFileChange(selectedFile);
  }

  function clearImage() {
    setError(null);
    onFileChange(null);
    onUrlChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const resolvedPreview = previewUrl ?? imageUrl.trim();

  return (
    <fieldset
      disabled={disabled}
      className="md:col-span-2 rounded-2xl border border-neutral-200 bg-white p-4"
    >
      <legend className="px-1 text-sm font-bold text-neutral-700">
        Imagen del plato
      </legend>

      <div className="grid gap-4 sm:grid-cols-[9rem_1fr] sm:items-start">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-dashed border-neutral-200 bg-neutral-50">
          {resolvedPreview ? (
            <img
              src={resolvedPreview}
              alt="Vista previa del plato"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-xs text-neutral-400">
              <ImagePlus size={26} />
              Sin imagen
            </div>
          )}

          {resolvedPreview ? (
            <button
              type="button"
              onClick={clearImage}
              aria-label="Quitar imagen"
              className="absolute right-2 top-2 rounded-full bg-neutral-950/80 p-1.5 text-white transition-colors hover:bg-red-600"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div>
          <input
            ref={inputRef}
            id="menu-item-image"
            type="file"
            accept={MENU_IMAGE_ACCEPT}
            onChange={handleFileChange}
            className="sr-only"
          />
          <label
            htmlFor="menu-item-image"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-red-600"
          >
            <Upload size={17} />
            Elegir desde el dispositivo
          </label>

          <p className="mt-2 text-xs leading-5 text-neutral-500">
            Puedes escoger una foto del teléfono o del explorador. Formatos JPG,
            PNG o WebP, hasta 5 MB. Se subirá cuando guardes el plato.
          </p>

          {file ? (
            <p className="mt-2 truncate text-xs font-bold text-emerald-700">
              Seleccionada: {file.name}
            </p>
          ) : null}

          {error ? (
            <p role="alert" className="mt-2 text-xs font-bold text-red-600">
              {error}
            </p>
          ) : null}

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <label
              htmlFor="menu-item-image-url"
              className="text-sm font-bold text-neutral-700"
            >
              URL de imagen <span className="font-normal text-neutral-400">(opcional)</span>
            </label>
            <div className="relative">
              <ImagePlus
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                size={17}
              />
              <input
                id="menu-item-image-url"
                type="url"
                value={imageUrl}
                onChange={(event) => onUrlChange(event.target.value)}
                placeholder="https://..."
                className="admin-input"
                style={{ paddingLeft: "2.75rem" }}
              />
            </div>
            {file && imageUrl.trim() ? (
              <p className="mt-2 text-xs text-neutral-500">
                La foto seleccionada tendrá prioridad sobre la URL al guardar.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
