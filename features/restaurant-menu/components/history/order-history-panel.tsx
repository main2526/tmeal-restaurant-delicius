import { ArrowLeft, CheckCircle2, History, Trash2 } from "lucide-react";

import { formatCurrency } from "../../lib/formatters";
import type { Language, OrderHistory, UiText } from "../../types";

interface OrderHistoryPanelProps {
  copy: UiText;
  history: OrderHistory[];
  isOpen: boolean;
  language: Language;
  onClear: () => void;
  onClose: () => void;
}

export function OrderHistoryPanel({
  copy,
  history,
  isOpen,
  language,
  onClear,
  onClose,
}: OrderHistoryPanelProps) {
  if (!isOpen) {
    return null;
  }

  function clearHistory() {
    if (window.confirm(copy.clearHistoryConfirm)) {
      onClear();
    }
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label={copy.history}
      className="animate-in slide-in-from-right fixed inset-0 z-[80] overflow-y-auto bg-white duration-300"
    >
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            aria-label={copy.back}
            onClick={onClose}
            className="rounded-full bg-neutral-100 p-2"
          >
            <ArrowLeft />
          </button>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">
            {copy.history} <span className="text-red-600">.</span>
          </h3>
          <button
            type="button"
            aria-label={copy.clearHistory}
            onClick={clearHistory}
            className="p-2 text-neutral-400"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-32 text-center italic opacity-30">
            <History size={60} className="mx-auto mb-4" />
            <p>{copy.noOrders}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((order) => (
              <article
                key={order.id}
                className="rounded-[2rem] border border-neutral-100 bg-neutral-50 p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {copy.orderId}
                      {order.id}
                    </p>
                    <p className="text-xs font-medium text-neutral-500">
                      {new Date(order.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[10px] font-black uppercase text-green-700">
                    <CheckCircle2 size={12} />
                    {copy.statusSent}
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        <span className="font-bold text-neutral-900">{item.qty}x</span>{" "}
                        {item.name[language]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-4">
                  <span className="text-xs font-bold uppercase text-neutral-400">
                    {copy.total}
                  </span>
                  <span className="text-lg font-black">{formatCurrency(order.total)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-12 w-full rounded-3xl bg-neutral-900 py-5 font-black uppercase tracking-tighter text-white"
        >
          {copy.back}
        </button>
      </div>
    </section>
  );
}
