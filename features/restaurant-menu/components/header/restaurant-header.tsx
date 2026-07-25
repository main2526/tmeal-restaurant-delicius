import { Globe, History } from "lucide-react";

import type { Language, UiText } from "../../types";

interface RestaurantHeaderProps {
  copy: UiText;
  language: Language;
  table: string;
  onOpenHistory: () => void;
  onToggleLanguage: () => void;
}

export function RestaurantHeader({
  copy,
  language,
  table,
  onOpenHistory,
  onToggleLanguage,
}: RestaurantHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={copy.history}
            onClick={onOpenHistory}
            className="rounded-xl bg-neutral-100 p-2 text-neutral-600 transition-colors hover:text-red-600"
          >
            <History size={20} />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {copy.welcome}
            </span>
            <h1 className="text-xl font-black italic leading-none tracking-tighter text-neutral-900">
              DELICIAS <span className="text-red-600">DE BÁVARO</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-100 p-2 text-[10px] font-black uppercase tracking-tighter"
          >
            <Globe size={14} className="text-red-600" />
            {language}
          </button>
          <div className="rounded-2xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-neutral-200">
            {copy.mesa} {table}
          </div>
        </div>
      </div>
    </header>
  );
}
