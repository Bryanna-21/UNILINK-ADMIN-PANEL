import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search..." }: Props) {
  return (
    <div className="flex items-center gap-3 bg-surface-raised border border-border px-4 py-2.5 rounded-xl">
      <Search size={16} className="text-ink-muted shrink-0" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="bg-transparent outline-none w-full text-sm text-ink placeholder:text-ink-muted"
      />
    </div>
  );
}
