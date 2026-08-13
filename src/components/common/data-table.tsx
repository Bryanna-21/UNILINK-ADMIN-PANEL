interface Column {
  key: string;

  label: string;
}

interface Props {
  columns: Column[];

  data: any[];
}

export default function DataTable({
  columns,
  data,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr
            className="
            text-left
            border-b
            border-white/10
          "
          >
            {columns.map(
              (column) => (
                <th
                  key={column.key}
                  className="pb-4"
                >
                  {column.label}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="
              border-b
              border-white/5
            "
            >
              {columns.map(
                (column) => (
                  <td
                    key={column.key}
                    className="py-5"
                  >
                    {
                      row[
                        column.key
                      ]
                    }
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
