import { Utensils } from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

import type { Category, MenuItem } from "../types";

interface CategoryRow {
  id: string;
  name_es: string;
  name_en: string;
  sort_order: number;
  is_visible: boolean;
}

interface MenuItemRow {
  id: number;
  category_id: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  price: number | string;
  image_url: string;
  sort_order: number;
  is_available: boolean;
}

export interface RestaurantCatalog {
  categories: Category[];
  menuItems: MenuItem[];
}

export async function fetchPublicCatalog(): Promise<RestaurantCatalog | null> {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return null;
  }

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("id, name_es, name_en, sort_order, is_visible")
      .eq("is_visible", true)
      .order("sort_order"),
    supabase
      .from("menu_items")
      .select(
        "id, category_id, name_es, name_en, description_es, description_en, price, image_url, sort_order, is_available",
      )
      .eq("is_available", true)
      .order("sort_order"),
  ]);

  if (categoriesResult.error || itemsResult.error) {
    throw new Error(categoriesResult.error?.message ?? itemsResult.error?.message);
  }

  const categories = (categoriesResult.data as CategoryRow[]).map((category) => ({
    id: category.id,
    name: { es: category.name_es, en: category.name_en },
    icon: Utensils,
    isVisible: category.is_visible,
    sortOrder: category.sort_order,
  }));

  const menuItems = (itemsResult.data as MenuItemRow[]).map((item) => ({
    id: Number(item.id),
    category: item.category_id,
    name: { es: item.name_es, en: item.name_en },
    description: { es: item.description_es, en: item.description_en },
    price: Number(item.price),
    image: item.image_url,
    isAvailable: item.is_available,
    sortOrder: item.sort_order,
  }));

  return { categories, menuItems };
}
