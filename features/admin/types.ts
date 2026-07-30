export type AdminSection = "overview" | "orders" | "menu" | "categories" | "qrs";

export type OrderStatus = "new" | "in_kitchen" | "ready" | "delivered" | "cancelled";

export interface AdminCategory {
  id: string;
  nameEs: string;
  nameEn: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface AdminMenuItem {
  id: number;
  categoryId: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  sortOrder: number;
  isAvailable: boolean;
}

export interface AdminOrderItem {
  id: number;
  menuItemId: number | null;
  nameEs: string;
  nameEn: string;
  unitPrice: number;
  quantity: number;
}

export interface AdminOrder {
  id: string;
  tableNumber: string;
  language: "es" | "en";
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
}

export interface MenuItemInput {
  id?: number;
  categoryId: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  price: number;
  imageUrl: string;
  imageFile?: File | null;
  sortOrder: number;
  isAvailable: boolean;
}

export interface CategoryInput {
  id: string;
  nameEs: string;
  nameEn: string;
  sortOrder: number;
  isVisible: boolean;
}
