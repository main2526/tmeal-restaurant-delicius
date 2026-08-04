import { z } from "zod";

import { isValidRestaurantTable } from "@/features/restaurant-menu/config/restaurant";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isValidTableAccess } from "@/lib/table-access";

const orderSchema = z.object({
  table: z.string().trim().refine(isValidRestaurantTable),
  tableAccessToken: z.string(),
  language: z.enum(["es", "en"]),
  items: z
    .array(
      z.object({
        menuItemId: z.number().int().positive(),
        quantity: z.number().int().positive().max(50),
      }),
    )
    .min(1)
    .max(30),
});

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json({ code: "invalid_order" }, { status: 400 });
  }

  if (!isValidTableAccess(parsed.data.table, parsed.data.tableAccessToken)) {
    return Response.json({ code: "invalid_table_access" }, { status: 403 });
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return Response.json({ code: "not_configured" }, { status: 503 });
  }

  const itemIds = parsed.data.items.map((item) => item.menuItemId);
  const uniqueItemIds = [...new Set(itemIds)];

  if (uniqueItemIds.length !== itemIds.length) {
    return Response.json({ code: "duplicated_items" }, { status: 400 });
  }

  const { data: menuItems, error: menuItemsError } = await supabase
    .from("menu_items")
    .select("id, name_es, name_en, price")
    .in("id", uniqueItemIds)
    .eq("is_available", true);

  if (menuItemsError || !menuItems || menuItems.length !== uniqueItemIds.length) {
    return Response.json({ code: "items_unavailable" }, { status: 409 });
  }

  const menuItemsById = new Map(menuItems.map((item) => [Number(item.id), item]));
  const orderItems = parsed.data.items.map((item) => ({
    ...item,
    menuItem: menuItemsById.get(item.menuItemId)!,
  }));
  const calculatedTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      table_number: parsed.data.table,
      customer_language: parsed.data.language,
      total: calculatedTotal,
      status: "new",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return Response.json({ code: "server_error" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      name_es: item.menuItem.name_es,
      name_en: item.menuItem.name_en,
      unit_price: item.menuItem.price,
      quantity: item.quantity,
    })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return Response.json({ code: "server_error" }, { status: 500 });
  }

  return Response.json({ id: order.id }, { status: 201 });
}
