import type { Category, CategoryId, Language } from "../../types";

interface CategoryTabsProps {
  activeCategory: CategoryId;
  categories: Category[];
  language: Language;
  onSelect: (categoryId: CategoryId) => void;
}

export function CategoryTabs({
  activeCategory,
  categories,
  language,
  onSelect,
}: CategoryTabsProps) {
  return (
    <section className="mt-6 overflow-hidden">
      <div className="no-scrollbar flex items-center gap-3 overflow-x-auto overflow-y-hidden px-6 py-2 [overscroll-behavior-x:contain] [-webkit-overflow-scrolling:touch]">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(category.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-6 py-3 text-xs font-bold transition-all ${
                isActive
                  ? "scale-[1.03] bg-red-600 text-white shadow-lg shadow-red-200"
                  : "border border-neutral-100 bg-white text-neutral-400"
              }`}
            >
              <Icon size={18} />
              {category.name[language]}
            </button>
          );
        })}
      </div>
    </section>
  );
}
