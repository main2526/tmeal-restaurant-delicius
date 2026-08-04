import type { CartItem, Language } from "../types";

interface SubmitOrderInput {
  items: CartItem[];
  language: Language;
  table: string;
  total: number;
  tableAccessToken: string;
}

type OrderErrorCode =
  | "not_configured"
  | "invalid_order"
  | "invalid_table_access"
  | "duplicated_items"
  | "items_unavailable"
  | "server_error";

const errorMessages: Record<Language, Record<OrderErrorCode, string>> = {
  es: {
    not_configured: "El sistema de pedidos no está disponible todavía.",
    invalid_order: "Revisa tu pedido e inténtalo de nuevo.",
    invalid_table_access: "Escanea el código QR de tu mesa para enviar el pedido.",
    duplicated_items: "Hay un producto repetido en tu pedido.",
    items_unavailable: "Uno o más productos ya no están disponibles.",
    server_error: "No se pudo registrar el pedido. Inténtalo de nuevo.",
  },
  en: {
    not_configured: "The ordering system is not available yet.",
    invalid_order: "Please review your order and try again.",
    invalid_table_access: "Scan your table's QR code before sending an order.",
    duplicated_items: "A product is repeated in your order.",
    items_unavailable: "One or more items are no longer available.",
    server_error: "We couldn't register the order. Please try again.",
  },
};

class RestaurantOrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RestaurantOrderError";
  }
}

function isOrderErrorCode(value: unknown): value is OrderErrorCode {
  return typeof value === "string" && value in errorMessages.es;
}

export async function submitRestaurantOrder(input: SubmitOrderInput) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table: input.table,
        tableAccessToken: input.tableAccessToken,
        language: input.language,
        items: input.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.qty,
        })),
      }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { code?: unknown } | null;
      const code = isOrderErrorCode(body?.code) ? body.code : "server_error";
      throw new RestaurantOrderError(errorMessages[input.language][code]);
    }

    return (await response.json()) as { id: string };
  } catch (error) {
    if (error instanceof RestaurantOrderError) {
      throw error;
    }

    throw new RestaurantOrderError(errorMessages[input.language].server_error);
  }
}
