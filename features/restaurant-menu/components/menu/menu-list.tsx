import { MenuItemCard } from "./menu-item-card";

import type { Language, MenuItem } from "../../types";

interface MenuListProps {
  categoryName: string;
  emptyMessage: string;
  items: MenuItem[];
  language: Language;
  optionsLabel: string;
  onAdd: (item: MenuItem) => void;
}

export function MenuList({
  categoryName,
  emptyMessage,
  items,
  language,
  optionsLabel,
  onAdd,
}: MenuListProps) {
  return (
    <section className="mt-10 space-y-4 px-6">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-black italic capitalize tracking-tight">{categoryName}</h2>
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          {items.length} {optionsLabel}
        </span>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} language={language} onAdd={onAdd} />
        ))}

        {items.length === 0 && (
          <div className="py-12 text-center italic text-neutral-400">{emptyMessage}</div>
        )}
      </div>
    </section>
  );
}
