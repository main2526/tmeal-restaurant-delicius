import { Minus, Plus } from "lucide-react";

interface QuantityControlProps {
  decreaseLabel: string;
  increaseLabel: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function QuantityControl({
  decreaseLabel,
  increaseLabel,
  quantity,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-neutral-50 px-4 py-2">
      <button
        type="button"
        aria-label={decreaseLabel}
        onClick={onDecrease}
        className="text-neutral-400 hover:text-black"
      >
        <Minus size={18} />
      </button>
      <span className="w-4 text-center font-bold">{quantity}</span>
      <button
        type="button"
        aria-label={increaseLabel}
        onClick={onIncrease}
        className="text-neutral-400 hover:text-black"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
