"use client";

import { Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

import type { AdminCategory, CategoryInput } from "../types";

interface CategoryManagerProps {
  categories: AdminCategory[];
  onSave: (category: CategoryInput, originalId?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const emptyCategory: CategoryInput = { id: "", nameEs: "", nameEn: "", sortOrder: 0, isVisible: true };

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 64);
}

export function CategoryManager({ categories, onSave, onDelete }: CategoryManagerProps) {
  const [draft, setDraft] = useState<CategoryInput>(emptyCategory);
  const [originalId, setOriginalId] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function editCategory(category: AdminCategory) {
    setDraft({ id: category.id, nameEs: category.nameEs, nameEn: category.nameEn, sortOrder: category.sortOrder, isVisible: category.isVisible });
    setOriginalId(category.id);
    setIsOpen(true);
  }

  function closeForm() { setDraft(emptyCategory); setOriginalId(undefined); setIsOpen(false); }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.nameEs.trim() || !draft.nameEn.trim()) return;
    const category = { ...draft, id: originalId ? draft.id : slugify(draft.nameEs), nameEs: draft.nameEs.trim(), nameEn: draft.nameEn.trim() };
    if (!category.id) return;
    setIsSaving(true);
    await onSave(category, originalId);
    setIsSaving(false);
    closeForm();
  }

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Organización</p><h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Categorías</h1><p className="mt-2 text-sm text-neutral-500">Ordena la carta y decide qué se muestra al cliente.</p></div><button type="button" onClick={() => { setDraft(emptyCategory); setOriginalId(undefined); setIsOpen(true); }} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 hover:bg-red-700"><Plus size={17} /> Nueva categoría</button></div>
      {isOpen ? <form onSubmit={handleSubmit} className="mb-7 rounded-2xl border border-red-100 bg-red-50/40 p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-black text-neutral-950">{originalId ? "Editar categoría" : "Nueva categoría"}</h2><p className="text-sm text-neutral-500">El identificador se genera automáticamente al crearla.</p></div><button type="button" onClick={closeForm} aria-label="Cerrar formulario" className="rounded-lg p-2 text-neutral-400 hover:bg-white hover:text-neutral-800"><X size={19} /></button></div><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-neutral-700">Nombre en español<input required value={draft.nameEs} onChange={(event) => setDraft({ ...draft, nameEs: event.target.value })} className="admin-input" /></label><label className="text-sm font-bold text-neutral-700">Name in English<input required value={draft.nameEn} onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })} className="admin-input" /></label><label className="text-sm font-bold text-neutral-700">Orden<input required min="0" type="number" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} className="admin-input" /></label><label className="flex items-center gap-2 self-end pb-3 text-sm font-bold text-neutral-700"><input type="checkbox" checked={draft.isVisible} onChange={(event) => setDraft({ ...draft, isVisible: event.target.checked })} className="h-4 w-4 accent-red-600" /> Visible para clientes</label></div><div className="mt-5 flex justify-end"><button type="submit" disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-3 text-sm font-black text-white hover:bg-red-600 disabled:opacity-50"><Save size={16} />{isSaving ? "Guardando..." : "Guardar categoría"}</button></div></form> : null}
      <div className="space-y-3">{categories.map((category) => <article key={category.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-sm font-black text-neutral-500">{category.sortOrder / 10}</div><div><h2 className="font-black text-neutral-950">{category.nameEs}</h2><p className="text-xs text-neutral-400">{category.nameEn} · {category.id}</p></div></div><div className="flex items-center gap-2"><span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${category.isVisible ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}>{category.isVisible ? <Check size={13} /> : null}{category.isVisible ? "Visible" : "Oculta"}</span><button type="button" onClick={() => editCategory(category)} aria-label={`Editar ${category.nameEs}`} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"><Pencil size={15} /></button><button type="button" onClick={() => { if (window.confirm(`¿Eliminar ${category.nameEs}?`)) void onDelete(category.id); }} aria-label={`Eliminar ${category.nameEs}`} className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div></article>)}</div>
    </section>
  );
}
