"use client";

import { CheckCircle2, ChefHat, Clock3, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { formatCurrency } from "@/features/restaurant-menu/lib/formatters";

import type { AdminOrder, OrderStatus } from "../types";

interface OrdersManagerProps {
  orders: AdminOrder[];
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
}

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "new", label: "Nuevo" },
  { value: "in_kitchen", label: "En cocina" },
  { value: "ready", label: "Listo" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

function statusStyle(status: OrderStatus) {
  return {
    new: "bg-red-50 text-red-700",
    in_kitchen: "bg-amber-50 text-amber-700",
    ready: "bg-blue-50 text-blue-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-neutral-100 text-neutral-500",
  }[status];
}

function statusIcon(status: OrderStatus) {
  if (status === "ready" || status === "delivered") return CheckCircle2;
  if (status === "cancelled") return XCircle;
  if (status === "in_kitchen") return ChefHat;
  return Clock3;
}

export function OrdersManager({ orders, onStatusChange }: OrdersManagerProps) {
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const filteredOrders = useMemo(
    () => (filter === "all" ? orders : orders.filter((order) => order.status === filter)),
    [filter, orders],
  );

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-red-600">Operación</p><h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Pedidos</h1><p className="mt-2 text-sm text-neutral-500">Actualiza el estado y mantén la cocina sincronizada.</p></div>
        <label className="flex items-center gap-3 text-sm font-bold text-neutral-500">Filtrar estado<select value={filter} onChange={(event) => setFilter(event.target.value as "all" | OrderStatus)} className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-bold text-neutral-800 outline-none focus:border-red-500"><option value="all">Todos</option>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      </div>
      {filteredOrders.length === 0 ? <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-16 text-center text-sm text-neutral-400">No hay pedidos con este filtro.</div> : <div className="space-y-4">{filteredOrders.map((order) => { const Icon = statusIcon(order.status); return <article key={order.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-3"><h2 className="text-xl font-black text-neutral-950">Mesa {order.tableNumber}</h2><span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${statusStyle(order.status)}`}><Icon size={13} />{statusOptions.find((option) => option.value === order.status)?.label}</span></div><p className="mt-1 text-xs text-neutral-400">{new Date(order.createdAt).toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" })} · #{order.id.slice(0, 8)}</p></div><select aria-label={`Estado del pedido de mesa ${order.tableNumber}`} value={order.status} onChange={(event) => void onStatusChange(order.id, event.target.value as OrderStatus)} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-700 outline-none focus:border-red-500">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div><div className="mt-5 divide-y divide-neutral-100 rounded-xl bg-neutral-50 px-4">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="text-neutral-600"><strong className="mr-2 text-neutral-950">{item.quantity}×</strong>{order.language === "es" ? item.nameEs : item.nameEn}</span><span className="font-bold text-neutral-800">{formatCurrency(item.unitPrice * item.quantity)}</span></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4"><span className="text-xs font-black uppercase tracking-widest text-neutral-400">Total</span><strong className="text-xl font-black text-red-600">{formatCurrency(order.total)}</strong></div></article>; })}</div>}
    </section>
  );
}
