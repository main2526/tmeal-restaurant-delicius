import { ChevronRight } from "lucide-react";

import { formatCurrency } from "../../lib/formatters";
import type { UiText } from "../../types";

interface FloatingCartButtonProps {
  cartCount: number;
  cartTotal: number;
  copy: UiText;
  onOpen: () => void;
}

export function FloatingCartButton({
  cartCount,
  cartTotal,
  copy,
  onOpen,
}: FloatingCartButtonProps) {
  if (cartCount === 0) {
    return null;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-6 duration-500">
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center justify-between rounded-[2.5rem] bg-neutral-900 p-5 text-white shadow-2xl transition-all hover:bg-black active:scale-95"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold">
            {cartCount}
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              {copy.viewOrder}
            </p>
            <p className="text-lg font-bold italic leading-none">{copy.myCart}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <span className="text-xl font-black">{formatCurrency(cartTotal)}</span>
          <ChevronRight className="transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>
  );
}
