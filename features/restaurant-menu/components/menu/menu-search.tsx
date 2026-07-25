import { Search } from "lucide-react";

interface MenuSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function MenuSearch({ placeholder, value, onChange }: MenuSearchProps) {
  return (
    <section className="px-6 pt-8">
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
          className="w-full rounded-3xl border-none bg-white py-4 pr-6 pl-12 text-sm shadow-sm outline-none transition-all focus:ring-2 focus:ring-red-500/20"
        />
      </div>
    </section>
  );
}
