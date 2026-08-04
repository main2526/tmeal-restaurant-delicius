export const RESTAURANT_CONFIG = {
  name: "DELICIAS DE BÁVARO",
  whatsappNumber: "18295914469",
  defaultTable: "1",
  tableCount: 12,
  defaultCategory: "entradas",
  storageKeys: {
    cart: "delicias_cart",
    history: "delicias_history",
  },
} as const;

export const RESTAURANT_TABLES = Array.from(
  { length: RESTAURANT_CONFIG.tableCount },
  (_, index) => String(index + 1),
);

export function isValidRestaurantTable(table: string): boolean {
  return RESTAURANT_TABLES.includes(table);
}
