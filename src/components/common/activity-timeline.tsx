const activities = [
  {
    id: 1,

    title:
      "University verified",

    time: "2 mins ago",
  },

  {
    id: 2,

    title:
      "Report resolved",

    time: "8 mins ago",
  },

  {
    id: 3,

    title:
      "Admin invited",

    time: "20 mins ago",
  },
];

export default function ActivityTimeline() {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">
        Activity Timeline
      </h2>

      <div className="space-y-6">
        {activities.map(
          (activity) => (
            <div
              key={activity.id}
              className="flex gap-4"
            >
              <div
                className="
                w-3
                h-3
                rounded-full
                bg-violet-500
                mt-2
              "
              />

              <div>
                <h4 className="font-semibold">
                  {
                    activity.title
                  }
                </h4>

                <p className="text-sm text-gray-400 mt-1">
                  {
                    activity.time
                  }
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
