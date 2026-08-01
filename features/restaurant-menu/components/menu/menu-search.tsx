import { Search } from "lucide-react";

interface MenuSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearch({ placeholder, value, onChange }: MenuSearchProps) {
  return (
    <section className="px-4 pt-5 sm:px-6 sm:pt-8">
      <div className="group relative">
        <Search
          size={20}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-300 transition-colors group-focus-within:text-red-500"
        />
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-neutral-100 bg-white py-3.5 pr-5 pl-12 text-base shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-red-100 focus:ring-2 focus:ring-red-500/20 sm:rounded-3xl sm:py-4 sm:pr-6 sm:text-sm"
        />
      </div>
    </section>
  );
}
