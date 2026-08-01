import { MenuItemCard } from "./menu-item-card";

import type { Language, MenuItem } from "../../types";

interface MenuListProps {
  addLabel: string;
  categoryName: string;
  emptyMessage: string;
  items: MenuItem[];
  language: Language;
  optionsLabel: string;
  onAdd: (item: MenuItem) => void;
}

export function MenuList({
  addLabel,
  categoryName,
  emptyMessage,
  items,
  language,
  optionsLabel,
  onAdd,
}: MenuListProps) {
  return (
    <section className="mt-7 space-y-3 px-4 sm:mt-10 sm:space-y-4 sm:px-6">
      <div className="mb-5 flex min-w-0 items-end justify-between gap-3 sm:mb-6">
        <h2 className="min-w-0 text-xl font-black italic capitalize tracking-tight sm:text-2xl">
          {categoryName}
        </h2>
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-neutral-400 sm:text-[10px]">
          {items.length} {optionsLabel}
        </span>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            addLabel={addLabel}
            language={language}
            onAdd={onAdd}
          />
        ))}

        {items.length === 0 && (
          <div className="py-12 text-center italic text-neutral-400">{emptyMessage}</div>
        )}
      </div>
    </section>
  );
}
