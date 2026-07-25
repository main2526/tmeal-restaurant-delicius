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
    <section className="no-scrollbar mt-8 flex gap-3 overflow-x-auto px-6">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(category.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-6 py-3 text-xs font-bold transition-all ${
              isActive
                ? "scale-105 bg-red-600 text-white shadow-lg shadow-red-200"
                : "border border-neutral-100 bg-white text-neutral-400"
            }`}
          >
            <Icon size={18} />
            {category.name[language]}
          </button>
        );
      })}
    </section>
  );
}
