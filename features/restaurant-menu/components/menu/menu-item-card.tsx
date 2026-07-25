/* eslint-disable @next/next/no-img-element -- The existing menu uses external image URLs directly. */

import { Plus } from "lucide-react";

import { formatCurrency } from "../../lib/formatters";
import type { Language, MenuItem } from "../../types";

interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  onAdd: (item: MenuItem) => void;
}

export function MenuItemCard({ item, language, onAdd }: MenuItemCardProps) {
  return (
    <article className="group flex gap-4 overflow-hidden rounded-3xl border border-neutral-100 bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={item.image}
          alt={item.name[language]}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="font-bold leading-tight text-neutral-800">{item.name[language]}</h3>
          <p className="mt-1 line-clamp-2 text-[11px] text-neutral-400">
            {item.description[language]}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-bold text-red-600">{formatCurrency(item.price)}</span>
          <button
            type="button"
            aria-label={`Añadir ${item.name[language]}`}
            onClick={() => onAdd(item)}
            className="rounded-xl bg-neutral-900 p-2 text-white transition-colors hover:bg-red-600"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
