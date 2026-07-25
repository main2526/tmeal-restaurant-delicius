import type { LucideIcon } from "lucide-react";

export type Language = "es" | "en";

export type CategoryId =
  | "entradas"
  | "ninos"
  | "pasteles_en_hoja"
  | "sandwich"
  | "ensaladas";

export interface LocalizedText {
  es: string;
  en: string;
}

export interface Category {
  id: CategoryId;
  name: LocalizedText;
  icon: LucideIcon;
}

export interface MenuItem {
  id: number;
  category: CategoryId;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export interface OrderHistory {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  status: "sent" | "cooking" | "ready";
}

export interface UiText {
  welcome: string;
  mesa: string;
  search: string;
  options: string;
  empty: string;
  viewOrder: string;
  myCart: string;
  yourOrder: string;
  subtotal: string;
  total: string;
  confirm: string;
  footer: string;
  history: string;
  noOrders: string;
  orderId: string;
  statusSent: string;
  clearHistory: string;
  added: string;
  back: string;
}
