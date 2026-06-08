interface Props {
  value: string;

  onChange: (
    value: string
  ) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      placeholder="Search..."
      className="
      glass
      w-full
      p-4
      rounded-xl
      outline-none
    "
    />
  );
}
