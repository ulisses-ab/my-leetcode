export function RenameError({ message }: { message: string }) {
  return (
    <div
      className="
        absolute left-0 top-full mt-1
        border border-red-400
        bg-red-700 text-white text-xs
        px-2 py-1 rounded
        shadow-md
        pointer-events-none
        z-50
      "
    >
      {message}
    </div>
  );
}
