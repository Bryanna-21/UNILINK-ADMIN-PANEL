"use client";

interface Props {
  message: string;
}

export default function Toast({
  message,
}: Props) {
  return (
    <div
      className="
      fixed
      bottom-6
      right-6
      glass
      px-5
      py-4
      rounded-2xl
      shadow-xl
      z-50
    "
    >
      {message}
    </div>
  );
}
