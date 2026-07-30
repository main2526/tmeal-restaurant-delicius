"use client";

import { Clock3, DollarSign, PackageCheck, RefreshCw, ShoppingBag } from "lucide-react";

import { formatCurrency } from "@/features/restaurant-menu/lib/formatters";

import type { AdminOrder, AdminMenuItem } from "../types";

interface AdminOverviewProps {
  orders: AdminOrder[];
  menuItems: AdminMenuItem[];
  onRefresh: () => void;
}

function statusLabel(status: AdminOrder["status"]) {
  return {
    new: "Nuevo",
    in_kitchen: "En cocina",
    ready: "Listo",
    delivered: "Entregado",
    cancelled: "Cancelado",
  }[status];
}

export function AdminOverview({ orders, menuItems, onRefresh }: AdminOverviewProps) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayOrders = orders.filter((order) => new Date(order.createdAt).getTime() >= startOfDay);
  const todaySales = todayOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.total, 0);
  const activeOrders = orders.filter((order) => ["new", "in_kitchen", "ready"].includes(order.status));

  const stats = [
    { label: "Pedidos de hoy", value: todayOrders.length, icon: ShoppingBag, tone: "bg-red-50 text-red-600" },
    { label: "Ventas de hoy", value: formatCurrency(todaySales), icon: DollarSign, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Pendientes", value: activeOrders.length, icon: Clock3, tone: "bg-amber-50 text-amber-600" },
    { label: "Platos activos", value: menuItems.filter((item) => item.isAvailable).length, icon: PackageCheck, tone: "bg-blue-50 text-blue-600" },
  ];

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Centro de control</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Buenos días, Delicias.</h1>
          <p className="mt-2 text-sm text-neutral-500">Una vista rápida de lo que está pasando en tu restaurante.</p>
        </div>
        <button type="button" onClick={onRefresh} className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-600 hover:border-red-200 hover:text-red-600">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className={`mb-6 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></div>
            <p className="text-sm font-medium text-neutral-500">{label}</p>
            <p className="mt-1 text-2xl font-black text-neutral-950">{value}</p>
          </article>
        ))}
      </div>

      <article className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div><h2 className="text-lg font-black text-neutral-950">Actividad reciente</h2><p className="text-sm text-neutral-500">Los últimos pedidos recibidos.</p></div>
          <ShoppingBag className="text-neutral-300" size={22} />
        </div>
        {orders.length === 0 ? <p className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-400">Todavía no hay pedidos registrados.</p> : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-100 px-4 py-3">
                <div><p className="text-sm font-black text-neutral-900">Mesa {order.tableNumber}</p><p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleString("es-DO", { dateStyle: "short", timeStyle: "short" })}</p></div>
                <div className="flex items-center gap-4"><span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">{statusLabel(order.status)}</span><strong className="text-sm">{formatCurrency(order.total)}</strong></div>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
