"use client";

import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

import { formatCurrency } from "@/features/restaurant-menu/lib/formatters";

import type { AdminCategory, AdminMenuItem, MenuItemInput } from "../types";
import { MenuItemImageField } from "./menu-item-image-field";

/* eslint-disable @next/next/no-img-element -- Admin cards display restaurant-provided image URLs. */

interface MenuManagerProps {
  categories: AdminCategory[];
  items: AdminMenuItem[];
  onSave: (item: MenuItemInput) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
  onToggleAvailability: (item: AdminMenuItem) => Promise<void>;
}

interface MenuItemDraft extends MenuItemInput {
  imageFile: File | null;
}

const emptyDraft: MenuItemDraft = {
  categoryId: "entradas",
  nameEs: "",
  nameEn: "",
  descriptionEs: "",
  descriptionEn: "",
  price: 0,
  imageUrl: "",
  imageFile: null,
  sortOrder: 0,
  isAvailable: true,
};

export function MenuManager({
  categories,
  items,
  onSave,
  onDelete,
  onToggleAvailability,
}: MenuManagerProps) {
  const [draft, setDraft] = useState<MenuItemDraft>(emptyDraft);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function newDraft() {
    return {
      ...emptyDraft,
      categoryId: categories[0]?.id ?? "entradas",
    };
  }

  function openNewItemForm() {
    setDraft(newDraft());
    setIsFormOpen(true);
  }

  function editItem(item: AdminMenuItem) {
    setDraft({
      id: item.id,
      categoryId: item.categoryId,
      nameEs: item.nameEs,
      nameEn: item.nameEn,
      descriptionEs: item.descriptionEs,
      descriptionEn: item.descriptionEn,
      price: item.price,
      imageUrl: item.imageUrl,
      imageFile: null,
      sortOrder: item.sortOrder,
      isAvailable: item.isAvailable,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setDraft(newDraft());
    setIsFormOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !draft.nameEs.trim() ||
      !draft.nameEn.trim() ||
      draft.price <= 0 ||
      !draft.categoryId
    ) {
      return;
    }

    setIsSaving(true);

    try {
      const wasSaved = await onSave({
        ...draft,
        nameEs: draft.nameEs.trim(),
        nameEn: draft.nameEn.trim(),
        descriptionEs: draft.descriptionEs.trim(),
        descriptionEn: draft.descriptionEn.trim(),
        imageUrl: draft.imageUrl.trim(),
      });

      if (wasSaved) {
        resetForm();
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
            Carta digital
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
            Menú
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Edita precios, fotos y disponibilidad sin tocar el código.
          </p>
        </div>
        <button
          type="button"
          onClick={openNewItemForm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 hover:bg-red-700 sm:w-auto"
        >
          <Plus size={17} />
          Nuevo plato
        </button>
      </div>

      {isFormOpen ? (
        <form
          onSubmit={handleSubmit}
          className="mb-7 rounded-2xl border border-red-100 bg-red-50/40 p-4 sm:p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-neutral-950">
                {draft.id ? "Editar plato" : "Nuevo plato"}
              </h2>
              <p className="text-sm text-neutral-500">
                Los nombres en ambos idiomas mantienen la carta bilingüe.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              aria-label="Cerrar formulario"
              className="rounded-lg p-2 text-neutral-400 hover:bg-white hover:text-neutral-800"
            >
              <X size={19} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-neutral-700">
              Nombre en español
              <input
                required
                value={draft.nameEs}
                onChange={(event) =>
                  setDraft({ ...draft, nameEs: event.target.value })
                }
                className="admin-input"
              />
            </label>

            <label className="text-sm font-bold text-neutral-700">
              Name in English
              <input
                required
                value={draft.nameEn}
                onChange={(event) =>
                  setDraft({ ...draft, nameEn: event.target.value })
                }
                className="admin-input"
              />
            </label>

            <label className="text-sm font-bold text-neutral-700">
              Categoría
              <select
                value={draft.categoryId}
                onChange={(event) =>
                  setDraft({ ...draft, categoryId: event.target.value })
                }
                className="admin-input"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameEs}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-bold text-neutral-700">
              Precio (RD$)
              <input
                required
                min="1"
                step="0.01"
                type="number"
                value={draft.price || ""}
                onChange={(event) =>
                  setDraft({ ...draft, price: Number(event.target.value) })
                }
                className="admin-input"
              />
            </label>

            <MenuItemImageField
              file={draft.imageFile}
              imageUrl={draft.imageUrl}
              disabled={isSaving}
              onFileChange={(imageFile) =>
                setDraft({ ...draft, imageFile })
              }
              onUrlChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
            />

            <label className="text-sm font-bold text-neutral-700">
              Descripción en español
              <textarea
                value={draft.descriptionEs}
                onChange={(event) =>
                  setDraft({ ...draft, descriptionEs: event.target.value })
                }
                rows={2}
                className="admin-input"
              />
            </label>

            <label className="text-sm font-bold text-neutral-700">
              Description in English
              <textarea
                value={draft.descriptionEn}
                onChange={(event) =>
                  setDraft({ ...draft, descriptionEn: event.target.value })
                }
                rows={2}
                className="admin-input"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm font-bold text-neutral-700">
              <input
                type="checkbox"
                checked={draft.isAvailable}
                onChange={(event) =>
                  setDraft({ ...draft, isAvailable: event.target.checked })
                }
                className="h-4 w-4 accent-red-600"
              />
              Disponible en la carta
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-sm font-black text-white hover:bg-red-600 disabled:cursor-wait disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Subiendo y guardando..." : "Guardar plato"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex min-w-0 gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-24 sm:w-24">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                  Sin foto
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                <div className="min-w-0">
                  <h2 className="line-clamp-2 break-words text-sm font-black leading-tight text-neutral-950 sm:text-base">
                    {item.nameEs}
                  </h2>
                  <p className="truncate text-xs text-neutral-400">
                    {item.nameEn}
                  </p>
                </div>
                <span className="whitespace-nowrap text-xs font-black text-red-600 sm:text-sm">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">
                <button
                  type="button"
                  onClick={() => void onToggleAvailability(item)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                    item.isAvailable
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {item.isAvailable ? "Disponible" : "Oculto"}
                </button>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => editItem(item)}
                    aria-label={`Editar ${item.nameEs}`}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar ${item.nameEs}?`)) {
                        void onDelete(item.id);
                      }
                    }}
                    aria-label={`Eliminar ${item.nameEs}`}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
