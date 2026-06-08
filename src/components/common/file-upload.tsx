"use client";

import { Upload } from "lucide-react";

interface Props {
  onUpload: (
    file: File
  ) => void;
}

export default function FileUpload({
  onUpload,
}: Props) {
  return (
    <label
      className="
      glass
      p-6
      rounded-2xl
      border-2
      border-dashed
      border-white/10
      flex
      flex-col
      items-center
      justify-center
      cursor-pointer
    "
    >
      <Upload size={32} />

      <p className="mt-3">
        Upload file
      </p>

      <input
        type="file"
        hidden
        onChange={(e) => {
          const file =
            e.target.files?.[0];

          if (file) {
            onUpload(file);
          }
        }}
      />
    </label>
  );
}
