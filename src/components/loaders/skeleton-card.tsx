export default function SkeletonCard() {
  return (
    <div className="card p-6 h-[130px] animate-pulse">
      <div className="bg-surface-raised h-4 w-28 rounded mb-5" />
      <div className="bg-surface-raised h-8 w-20 rounded" />
    </div>
  );
}
