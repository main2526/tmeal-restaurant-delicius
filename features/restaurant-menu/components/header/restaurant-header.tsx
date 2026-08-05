import { History, ShieldCheck } from "lucide-react";
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
  const isSpanish = language === "es";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isSpanish ? "Idioma español. Cambiar a inglés" : "English language. Switch to Spanish"}
      className="group flex h-[38px] min-w-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-2.5 text-neutral-800 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 active:scale-95 sm:h-[40px] sm:rounded-2xl sm:px-3"
    >
      <span
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-sm ring-1 ring-neutral-200 transition-transform group-hover:scale-105"
        style={{ width: 28, height: 28, flexBasis: 28 }}
      >
        {isSpanish ? <DominicanFlag /> : <UnitedStatesFlag />}
      </span>
      <span className="text-[11px] font-black uppercase tracking-[0.08em] text-neutral-800 group-hover:text-red-600 sm:text-xs">
        {isSpanish ? "ES" : "EN"}
      </span>
    </button>
  );
}

function DominicanFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 30 20" width="30" height="20" style={{ display: "block", width: 30, height: 20, maxWidth: "none", flex: "none" }}>
      <rect width="30" height="20" fill="#fff" />
      <path fill="#002d62" d="M0 0h13v8H0zm17 12h13v8H17z" />
      <path fill="#ce1126" d="M17 0h13v8H17zM0 12h13v8H0z" />
      <circle cx="15" cy="10" r="2.1" fill="#fff" stroke="#006847" strokeWidth=".7" />
      <path d="m15 8.7.7 1.8h-1.4z" fill="#ce1126" />
    </svg>
  );
}

function UnitedStatesFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 30 20" width="30" height="20" style={{ display: "block", width: 30, height: 20, maxWidth: "none", flex: "none" }}>
      <rect width="30" height="20" fill="#fff" />
      {[0, 4, 8, 12, 16].map((y) => <rect key={y} y={y} width="30" height="2" fill="#b22234" />)}
      <rect width="13" height="10.8" fill="#3c3b6e" />
      {[2, 5, 8, 11].map((x) => [2, 5, 8].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".65" fill="#fff" />))}
    </svg>
  );
}

function TableBadge({ label, table }: { label: string; table: string }) {
  return (
    <div className="shrink-0 rounded-xl bg-neutral-900 px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-neutral-200 sm:rounded-2xl sm:px-4 sm:text-xs">
      {label} {table}
    </div>
  );
}
