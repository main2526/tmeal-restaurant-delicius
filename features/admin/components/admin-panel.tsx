"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getSupabaseBrowserClient, hasSupabasePublicConfig } from "@/lib/supabase/client";

import { AdminLogin } from "./admin-login";
import { AdminOverview } from "./admin-overview";
import { AdminSidebar } from "./admin-sidebar";
import { CategoryManager } from "./category-manager";
import { MenuManager } from "./menu-manager";
import { OrdersManager } from "./orders-manager";
import { QrManager } from "./qr-manager";
import { uploadMenuImage } from "../lib/menu-image-storage";
import type { AdminCategory, AdminMenuItem, AdminOrder, AdminSection, CategoryInput, MenuItemInput, OrderStatus } from "../types";

type AuthStatus = "loading" | "signed_out" | "admin" | "denied" | "config_missing";

interface RawCategory { id: string; name_es: string; name_en: string; sort_order: number; is_visible: boolean }
interface RawMenuItem { id: number; category_id: string; name_es: string; name_en: string; description_es: string; description_en: string; price: number | string; image_url: string; sort_order: number; is_available: boolean }
interface RawOrder { id: string; table_number: string; customer_language: "es" | "en"; status: OrderStatus; total: number | string; created_at: string; updated_at: string }
interface RawOrderItem { id: number; order_id: string; menu_item_id: number | null; name_es: string; name_en: string; unit_price: number | string; quantity: number }

function mapCategory(row: RawCategory): AdminCategory { return { id: row.id, nameEs: row.name_es, nameEn: row.name_en, sortOrder: row.sort_order, isVisible: row.is_visible }; }
function mapMenuItem(row: RawMenuItem): AdminMenuItem { return { id: Number(row.id), categoryId: row.category_id, nameEs: row.name_es, nameEn: row.name_en, descriptionEs: row.description_es, descriptionEn: row.description_en, price: Number(row.price), imageUrl: row.image_url, sortOrder: row.sort_order, isAvailable: row.is_available }; }

export function AdminPanel() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>(hasSupabasePublicConfig() ? "loading" : "config_missing");
  const [email, setEmail] = useState("");
  const [section, setSection] = useState<AdminSection>("overview");
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadData = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setIsLoadingData(true);
    const [categoriesResult, menuResult, ordersResult, orderItemsResult] = await Promise.all([
      supabase.from("menu_categories").select("id, name_es, name_en, sort_order, is_visible").order("sort_order"),
      supabase.from("menu_items").select("id, category_id, name_es, name_en, description_es, description_en, price, image_url, sort_order, is_available").order("category_id").order("sort_order"),
      supabase.from("orders").select("id, table_number, customer_language, status, total, created_at, updated_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("order_items").select("id, order_id, menu_item_id, name_es, name_en, unit_price, quantity").order("id"),
    ]);

    const failed = categoriesResult.error ?? menuResult.error ?? ordersResult.error ?? orderItemsResult.error;
    if (failed) {
      setNotice(failed.message);
      setIsLoadingData(false);
      return;
    }

    const rawItems = (orderItemsResult.data ?? []) as RawOrderItem[];
    const itemsByOrder = new Map<string, RawOrderItem[]>();
    rawItems.forEach((item) => itemsByOrder.set(item.order_id, [...(itemsByOrder.get(item.order_id) ?? []), item]));
    setCategories(((categoriesResult.data ?? []) as RawCategory[]).map(mapCategory));
    setMenuItems(((menuResult.data ?? []) as RawMenuItem[]).map(mapMenuItem));
    setOrders(((ordersResult.data ?? []) as RawOrder[]).map((order) => ({ id: order.id, tableNumber: order.table_number, language: order.customer_language, status: order.status, total: Number(order.total), createdAt: order.created_at, updatedAt: order.updated_at, items: (itemsByOrder.get(order.id) ?? []).map((item) => ({ id: Number(item.id), menuItemId: item.menu_item_id === null ? null : Number(item.menu_item_id), nameEs: item.name_es, nameEn: item.name_en, unitPrice: Number(item.unit_price), quantity: item.quantity })) })));
    setIsLoadingData(false);
  }, []);

  const refreshSession = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setAuthStatus("config_missing"); return; }
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) { setAuthStatus("signed_out"); return; }

    const { data: admin, error } = await supabase.from("restaurant_admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
    if (error) { setNotice(error.message); setAuthStatus("denied"); return; }
    if (!admin) { setAuthStatus("denied"); return; }
    setEmail(session.user.email ?? "Administrador");
    setAuthStatus("admin");
    await loadData();
  }, [loadData]);

  useEffect(() => {
    void Promise.resolve().then(refreshSession);
  }, [refreshSession]);

  async function runMutation(
    action: () => PromiseLike<{ error: { message: string } | null }>,
    successMessage: string,
  ) {
    const result = await action();
    if (result.error) {
      setNotice(result.error.message);
      return false;
    }

    await loadData();
    setNotice(successMessage);
    return true;
  }

  async function saveMenuItem(item: MenuItemInput) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return false;

    let imageUrl = item.imageUrl;

    if (item.imageFile) {
      try {
        imageUrl = await uploadMenuImage(item.imageFile);
      } catch (error) {
        setNotice(
          error instanceof Error
            ? error.message
            : "No se pudo subir la imagen. Inténtalo nuevamente.",
        );
        return false;
      }
    }

    const values = {
      category_id: item.categoryId,
      name_es: item.nameEs,
      name_en: item.nameEn,
      description_es: item.descriptionEs,
      description_en: item.descriptionEn,
      price: item.price,
      image_url: imageUrl,
      sort_order: item.sortOrder,
      is_available: item.isAvailable,
    };

    return runMutation(
      () =>
        item.id
          ? supabase.from("menu_items").update(values).eq("id", item.id)
          : supabase.from("menu_items").insert(values),
      "Plato guardado correctamente.",
    );
  }

  async function deleteMenuItem(id: number) { const supabase = getSupabaseBrowserClient(); if (!supabase) return; await runMutation(() => supabase.from("menu_items").delete().eq("id", id), "Plato eliminado."); }
  async function toggleAvailability(item: AdminMenuItem) { const supabase = getSupabaseBrowserClient(); if (!supabase) return; await runMutation(() => supabase.from("menu_items").update({ is_available: !item.isAvailable }).eq("id", item.id), item.isAvailable ? "Plato ocultado de la carta." : "Plato publicado en la carta."); }

  async function saveCategory(category: CategoryInput, originalId?: string) { const supabase = getSupabaseBrowserClient(); if (!supabase) return; await runMutation(() => originalId ? supabase.from("menu_categories").update({ name_es: category.nameEs, name_en: category.nameEn, sort_order: category.sortOrder, is_visible: category.isVisible }).eq("id", originalId) : supabase.from("menu_categories").insert({ id: category.id, name_es: category.nameEs, name_en: category.nameEn, sort_order: category.sortOrder, is_visible: category.isVisible }), "Categoría guardada correctamente."); }
  async function deleteCategory(id: string) { const supabase = getSupabaseBrowserClient(); if (!supabase) return; await runMutation(() => supabase.from("menu_categories").delete().eq("id", id), "Categoría eliminada."); }
  async function updateOrderStatus(id: string, status: OrderStatus) { const supabase = getSupabaseBrowserClient(); if (!supabase) return; await runMutation(() => supabase.from("orders").update({ status }).eq("id", id), "Estado del pedido actualizado."); }

  async function signOut() { const supabase = getSupabaseBrowserClient(); await supabase?.auth.signOut(); setAuthStatus("signed_out"); setEmail(""); }

  if (authStatus === "loading") return <main className="flex min-h-screen items-center justify-center bg-[#f6f7f8]"><Loader2 className="animate-spin text-red-600" size={28} /></main>;
  if (authStatus === "signed_out" || authStatus === "config_missing") return <AdminLogin onMessage={setNotice} onSuccess={() => void refreshSession()} />;
  if (authStatus === "denied") return <main className="flex min-h-screen items-center justify-center bg-[#f6f7f8] px-5"><section className="max-w-md rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xl"><AlertCircle className="mx-auto text-red-600" size={34} /><h1 className="mt-4 text-2xl font-black">Acceso no autorizado</h1><p className="mt-3 text-sm leading-6 text-neutral-500">Tu usuario de Supabase existe, pero todavía no está registrado como administrador del restaurante.</p><button type="button" onClick={() => void signOut()} className="mt-6 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-black text-white">Cerrar sesión</button></section></main>;

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f8] lg:flex-row">
      <AdminSidebar
        activeSection={section}
        email={email}
        onSelect={setSection}
        onSignOut={() => void signOut()}
      />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <div className="mx-auto w-full max-w-7xl">
          {notice ? (
            <div
              role="status"
              className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800"
            >
              <span className="min-w-0 break-words">{notice}</span>
              <button
                type="button"
                aria-label="Cerrar aviso"
                onClick={() => setNotice(null)}
                className="shrink-0 text-blue-500"
              >
                ×
              </button>
            </div>
          ) : null}
          {isLoadingData ? (
            <div className="mb-5 flex items-center gap-2 text-xs font-bold text-neutral-400">
              <Loader2 className="animate-spin" size={14} />
              Sincronizando datos...
            </div>
          ) : null}
          {section === "overview" ? (
            <AdminOverview orders={orders} menuItems={menuItems} onRefresh={() => void loadData()} />
          ) : null}
          {section === "orders" ? (
            <OrdersManager orders={orders} onStatusChange={updateOrderStatus} />
          ) : null}
          {section === "menu" ? (
            <MenuManager
              categories={categories}
              items={menuItems}
              onSave={saveMenuItem}
              onDelete={deleteMenuItem}
              onToggleAvailability={toggleAvailability}
            />
          ) : null}
          {section === "categories" ? (
            <CategoryManager categories={categories} onSave={saveCategory} onDelete={deleteCategory} />
          ) : null}
          {section === "qrs" ? <QrManager /> : null}
        </div>
      </main>
    </div>
  );
}
