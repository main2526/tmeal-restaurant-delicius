import { Globe, History, ShieldCheck } from "lucide-react";
import Link from "next/link";

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
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
      <div className="mx-auto max-w-2xl">
        <div className="sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <Brand copy={copy} />
            <TableBadge label={copy.mesa} table={table} />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              type="button"
              aria-label={copy.history}
              onClick={onOpenHistory}
              className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-[11px] font-bold text-neutral-600 transition-colors hover:text-red-600"
            >
              <History size={16} />
              <span className="truncate">{copy.history}</span>
            </button>
            <Link
              href="/admin"
              aria-label={copy.adminPanel}
              title={copy.adminPanel}
              className="flex min-w-0 items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-[11px] font-bold text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <ShieldCheck size={16} />
              <span>Admin</span>
            </Link>
            <LanguageButton language={language} onToggle={onToggleLanguage} />
          </div>
        </div>

        <div className="hidden items-center justify-between gap-4 sm:flex">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label={copy.history}
                onClick={onOpenHistory}
                className="rounded-xl bg-neutral-100 p-2 text-neutral-600 transition-colors hover:text-red-600"
              >
                <History size={20} />
              </button>
              <Link
                href="/admin"
                aria-label={copy.adminPanel}
                title={copy.adminPanel}
                className="rounded-xl bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <ShieldCheck size={20} />
              </Link>
            </div>
            <Brand copy={copy} />
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <LanguageButton language={language} onToggle={onToggleLanguage} />
            <TableBadge label={copy.mesa} table={table} />
          </div>
        </div>
      </div>
    </header>
  );
}

function Brand({ copy }: { copy: UiText }) {
  return (
    <div className="min-w-0">
      <span className="block text-[9px] font-bold uppercase leading-none tracking-[0.16em] text-red-500 sm:text-[10px]">
        {copy.welcome}
      </span>
      <h1 className="mt-1 whitespace-nowrap text-[clamp(0.95rem,5vw,1.125rem)] font-black italic leading-none tracking-tighter text-neutral-900 sm:text-xl">
        DELICIAS <span className="text-red-600">DE BÁVARO</span>
      </h1>
    </div>
  );
}

function LanguageButton({
  language,
  onToggle,
}: {
  language: Language;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={language === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
      className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-[10px] font-black uppercase tracking-tight transition-colors hover:border-red-200 hover:text-red-600 sm:rounded-2xl"
    >
      <Globe size={14} className="shrink-0 text-red-600" />
      {language}
    </button>
  );
}

function TableBadge({ label, table }: { label: string; table: string }) {
  return (
    <div className="shrink-0 rounded-xl bg-neutral-900 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-neutral-200 sm:rounded-2xl sm:px-4 sm:text-xs">
      {label} {table}
    </div>
  );
}
