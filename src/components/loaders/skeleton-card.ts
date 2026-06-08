export default function SkeletonCard() {
  return (
    <div
      className="
      animate-pulse
      card
      h-[150px]
    "
    >
      <div
        className="
        bg-white/10
        h-5
        w-32
        rounded
        mb-6
      "
      />

      <div
        className="
        bg-white/10
        h-10
        w-24
        rounded
      "
      />
    </div>
  );
}
