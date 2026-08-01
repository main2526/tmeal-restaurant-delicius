"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollControls = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(container.scrollLeft > 2);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 2);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    updateScrollControls();
    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [categories, updateScrollControls]);

  function scrollCategories(direction: -1 | 1) {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollBy({
      left: direction * Math.max(240, container.clientWidth * 0.7),
      behavior: "smooth",
    });
  }

  return (
    <section aria-label={language === "es" ? "Categorías del menú" : "Menu categories"} className="relative mt-4 overflow-hidden sm:mt-6">
      <button
        type="button"
        aria-label={language === "es" ? "Ver categorías anteriores" : "View previous categories"}
        disabled={!canScrollLeft}
        onClick={() => scrollCategories(-1)}
        className="absolute top-1/2 left-2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-lg transition hover:border-red-200 hover:text-red-600 disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={updateScrollControls}
        className="no-scrollbar flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overflow-y-hidden px-4 py-2 sm:gap-3 sm:px-6 md:px-14 [overscroll-behavior-x:contain] [-webkit-overflow-scrolling:touch]"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(category.id)}
              className={`flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-xs font-bold transition-all sm:rounded-2xl sm:px-6 ${
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

      <button
        type="button"
        aria-label={language === "es" ? "Ver más categorías" : "View more categories"}
        disabled={!canScrollRight}
        onClick={() => scrollCategories(1)}
        className="absolute top-1/2 right-2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-lg transition hover:border-red-200 hover:text-red-600 disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
