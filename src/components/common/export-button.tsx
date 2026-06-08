"use client";

interface Props {
  data: any[];

  filename: string;
}

export default function ExportButton({
  data,
  filename,
}: Props) {
  function exportCSV() {
    const csv =
      [
        Object.keys(data[0]).join(","),
        ...data.map((row) =>
          Object.values(row).join(",")
        ),
      ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `${filename}.csv`;

    a.click();
  }

  return (
    <button
      onClick={exportCSV}
      className="
      bg-green-600
      hover:bg-green-700
      px-5
      py-3
      rounded-xl
    "
    >
      Export CSV
    </button>
  );
}
