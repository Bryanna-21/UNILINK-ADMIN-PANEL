const activities = [
  {
    id: 1,
    title: "New university verified",
    time: "2 mins ago",
  },

  {
    id: 2,
    title: "Admin resolved report",
    time: "10 mins ago",
  },

  {
    id: 3,
    title: "AI moderation flagged content",
    time: "24 mins ago",
  },

  {
    id: 4,
    title: "500 new users joined",
    time: "1 hour ago",
  },
];

export default function ActivityCard() {
  return (
    <div className="card h-[400px]">
      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="
            bg-white/5
            rounded-xl
            p-4
          "
          >
            <h4 className="font-semibold">
              {activity.title}
            </h4>

            <p className="text-sm text-gray-400 mt-1">
              {activity.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
