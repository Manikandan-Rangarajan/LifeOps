export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        mt-2 w-full rounded-md bg-indigo-600
        py-2 text-sm font-medium text-white
        hover:bg-indigo-700
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
        transition
      "
    >
      {children}
    </button>
  );
}
