"use client";

import {
  ArrowLeft,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  QrCode,
  Tags,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

import type { AdminSection } from "../types";

const links: Array<{ id: AdminSection; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", icon: ClipboardList },
  { id: "menu", label: "Menú", icon: UtensilsCrossed },
  { id: "categories", label: "Categorías", icon: Tags },
  { id: "qrs", label: "Mesas QR", icon: QrCode },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  email: string;
  onSelect: (section: AdminSection) => void;
  onSignOut: () => void;
}

export function AdminSidebar({ activeSection, email, onSelect, onSignOut }: AdminSidebarProps) {
  return (
    <aside className="sticky top-0 z-40 flex w-full shrink-0 flex-col border-b border-neutral-200 bg-white/95 backdrop-blur-xl lg:h-screen lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-6 lg:py-7">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-xs font-black text-white lg:h-10 lg:w-10 lg:text-sm">DB</div>
        <div className="min-w-0">
          <p className="text-sm font-black text-neutral-950">Delicias</p>
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-400 lg:text-[10px] lg:tracking-[0.16em]">Administración</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:hidden">
          <Link
            href="/"
            aria-label="Volver al menú público"
            className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-[11px] font-bold text-neutral-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700"
          >
            <ArrowLeft size={14} />
            Menú
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Cerrar sesión"
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 text-[11px] font-bold text-neutral-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700 sm:px-3"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <nav aria-label="Secciones del panel" className="grid grid-cols-5 gap-1 px-2 pb-2 sm:px-4 lg:flex lg:flex-col lg:px-3 lg:pb-0">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-current={activeSection === id ? "page" : undefined}
            className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[9px] font-bold transition sm:text-[10px] lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
              activeSection === id
                ? "bg-red-50 text-red-700"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            <Icon className="shrink-0" size={18} />
            <span className="w-full truncate text-center lg:w-auto lg:text-left">{label}</span>
          </button>
        ))}
      </nav>

      <Link
        href="/"
        className="mx-3 mt-4 hidden items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-700 lg:flex"
      >
        <ArrowLeft size={17} />
        Volver al menú
      </Link>

      <div className="mt-auto hidden border-t border-neutral-100 p-4 lg:block">
        <p className="truncate px-2 text-[11px] text-neutral-400">{email}</p>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-neutral-500 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
