interface Props {
  student: {
    name: string;

    university: string;

    course: string;

    status: string;
  };
}

export default function StudentProfileCard({
  student,
}: Props) {
  return (
    <div className="card">
      <div
        className="
        flex
        items-center
        gap-4
      "
      >
        <div
          className="
          w-16
          h-16
          rounded-full
          bg-violet-600
          flex
          items-center
          justify-center
          text-2xl
          font-bold
        "
        >
          {student.name.charAt(0)}
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            {student.name}
          </h2>

          <p className="text-gray-400">
            {
              student.university
            }
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div
          className="
          flex
          justify-between
        "
        >
          <span className="text-gray-400">
            Course
          </span>

          <span>
            {student.course}
          </span>
        </div>

        <div
          className="
          flex
          justify-between
        "
        >
          <span className="text-gray-400">
            Status
          </span>

          <span>
            {student.status}
          </span>
        </div>
      </div>
    </div>
  );
}
