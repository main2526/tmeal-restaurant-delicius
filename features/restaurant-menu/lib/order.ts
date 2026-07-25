import { RESTAURANT_CONFIG } from "../config/restaurant";
import type { CartItem, Language, OrderHistory } from "../types";

interface CreateOrderInput {
  items: CartItem[];
  total: number;
}

interface WhatsAppOrderInput extends CreateOrderInput {
  language: Language;
  table: string;
}

export function createOrder({ items, total }: CreateOrderInput): OrderHistory {
  return {
    id: Math.random().toString(36).slice(2, 7).toUpperCase(),
    timestamp: Date.now(),
    items: [...items],
    total,
    status: "sent",
  };
}

export function createWhatsAppOrderUrl({
  items,
  total,
  language,
  table,
}: WhatsAppOrderInput) {
  let message = `*${RESTAURANT_CONFIG.name} - PEDIDO MESA ${table}*\n\n`;

  items.forEach((item) => {
    message += `• ${item.qty}x ${item.name[language]}\n`;
  });

  message += `\n*TOTAL: RD$ ${total.toLocaleString()}*`;

  return `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
