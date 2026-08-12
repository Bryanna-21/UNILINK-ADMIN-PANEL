"use client";

interface Props {
  university: {
    id: string;

    name: string;

    students: number;

    verified: boolean;
  };

  onVerify: () => void;
}

export default function UniversityCard({
  university,
  onVerify,
}: Props) {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold">
        {university.name}
      </h2>

      <p className="text-gray-400 mt-3">
        {university.students} students
      </p>

      <div className="mt-5">
        {university.verified ? (
          <span
            className="
            bg-green-500/20
            text-green-400
            px-4
            py-2
            rounded-lg
          "
          >
            Verified
          </span>
        ) : (
          <button
            onClick={onVerify}
            className="
            bg-slate-700
            hover:bg-slate-600
            px-4
            py-2
            rounded-lg
          "
          >
            Verify
          </button>
        )}
      </div>
    </div>
  );
}
