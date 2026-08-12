import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  value: string;
  growth: string;
  hint?: string;
}

export default function StatsCard({ title, value, growth, hint }: Props) {
  return (
    <div className="card group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
          <ArrowUpRight size={16} />
        </div>
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-4">{value}</h2>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-semibold text-emerald-600">{growth}</span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}
