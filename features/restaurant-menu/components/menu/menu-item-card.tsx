/* eslint-disable @next/next/no-img-element -- The existing menu uses external image URLs directly. */

import { Plus } from "lucide-react";

import { formatCurrency } from "../../lib/formatters";
import type { Language, MenuItem } from "../../types";

interface MenuItemCardProps {
  addLabel: string;
  item: MenuItem;
  language: Language;
  onAdd: (item: MenuItem) => void;
}

export function MenuItemCard({
  addLabel,
  item,
  language,
  onAdd,
}: MenuItemCardProps) {
  return (
    <article className="group flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-2.5 shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:gap-4 sm:rounded-3xl sm:p-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-24 sm:w-24 sm:rounded-2xl">
        <img
          src={item.image}
          alt={item.name[language]}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="min-w-0">
          <h3 className="line-clamp-2 break-words text-sm font-bold leading-tight text-neutral-800 sm:text-base">
            {item.name[language]}
          </h3>
          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-neutral-400 sm:text-[11px]">
            {item.description[language]}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="min-w-0 text-sm font-bold text-red-600">
            {formatCurrency(item.price)}
          </span>
          <button
            type="button"
            aria-label={`${addLabel} ${item.name[language]}`}
            onClick={() => onAdd(item)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-colors hover:bg-red-600"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
