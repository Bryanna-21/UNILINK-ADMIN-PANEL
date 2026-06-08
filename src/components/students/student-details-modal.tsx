interface Props {
  student: {
    name: string;

    email: string;

    university: string;

    course: string;

    year: number;

    status: string;
  };
}

export default function StudentDetailsModal({
  student,
}: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        Student Profile
      </h2>

      <div className="space-y-5">
        <div>
          <p className="text-gray-400">
            Name
          </p>

          <h3 className="text-xl">
            {student.name}
          </h3>
        </div>

        <div>
          <p className="text-gray-400">
            Email
          </p>

          <h3 className="text-xl">
            {student.email}
          </h3>
        </div>

        <div>
          <p className="text-gray-400">
            University
          </p>

          <h3 className="text-xl">
            {
              student.university
            }
          </h3>
        </div>

        <div>
          <p className="text-gray-400">
            Course
          </p>

          <h3 className="text-xl">
            {student.course}
          </h3>
        </div>

        <div>
          <p className="text-gray-400">
            Academic Year
          </p>

          <h3 className="text-xl">
            Year {student.year}
          </h3>
        </div>

        <div>
          <p className="text-gray-400">
            Status
          </p>

          <h3 className="text-xl">
            {student.status}
          </h3>
        </div>
      </div>
    </div>
  );
}
