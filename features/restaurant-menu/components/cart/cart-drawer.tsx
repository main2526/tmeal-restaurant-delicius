import { ChefHat, X } from "lucide-react";

import { formatCurrency } from "../../lib/formatters";
import type { CartItem, Language, UiText } from "../../types";
import { QuantityControl } from "./quantity-control";

interface CartDrawerProps {
  cart: CartItem[];
  cartTotal: number;
  copy: UiText;
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onConfirm: () => void;
  onQuantityChange: (itemId: number, change: number) => void;
}

export function CartDrawer({
  cart,
  cartTotal,
  copy,
  isOpen,
  language,
  onClose,
  onConfirm,
  onQuantityChange,
}: CartDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={copy.yourOrder}
        className="animate-in slide-in-from-bottom-full fixed right-0 bottom-0 left-0 z-[70] max-h-[90vh] overflow-y-auto rounded-t-[3rem] bg-white p-8 duration-500"
      >
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">
            {copy.yourOrder} <span className="text-red-600">.</span>
          </h3>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="rounded-full bg-neutral-100 p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-neutral-50 pb-4"
            >
              <div className="flex-1">
                <h4 className="font-bold text-neutral-800">{item.name[language]}</h4>
                <p className="text-xs font-bold text-red-600">{formatCurrency(item.price)}</p>
              </div>
              <QuantityControl
                quantity={item.qty}
                onDecrease={() => onQuantityChange(item.id, -1)}
                onIncrease={() => onQuantityChange(item.id, 1)}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between border-t border-neutral-100 pt-6 text-xl font-black">
            <span>{copy.total}</span>
            <span className="text-2xl font-black text-red-600">{formatCurrency(cartTotal)}</span>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-3xl bg-red-600 py-6 text-lg font-black text-white shadow-xl shadow-red-100 transition-transform active:scale-95"
          >
            <ChefHat />
            {copy.confirm}
          </button>
        </div>
      </section>
    </>
  );
}
