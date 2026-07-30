"use client";

import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  QrCode,
  Tags,
  UtensilsCrossed,
} from "lucide-react";

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
    <aside className="flex w-full shrink-0 flex-col border-b border-neutral-200 bg-white lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3 px-5 py-5 lg:px-6 lg:py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-sm font-black text-white">DB</div>
        <div>
          <p className="text-sm font-black text-neutral-950">Delicias</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Administración</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeSection === id
                ? "bg-red-50 text-red-700"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

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
