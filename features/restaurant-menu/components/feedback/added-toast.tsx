import { CheckCircle2 } from "lucide-react";

interface AddedToastProps {
  message: string;
  visible: boolean;
}

export function AddedToast({ message, visible }: AddedToastProps) {
  return (
    <div
      aria-live="polite"
      className={`fixed top-24 left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-black italic tracking-tighter text-white shadow-2xl">
        <CheckCircle2 size={16} />
        {message}
      </div>
    </div>
  );
}
