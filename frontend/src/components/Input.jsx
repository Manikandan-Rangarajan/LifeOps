export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        {...props}
        className="
          w-full rounded-md border border-gray-300 bg-gray-50
          px-3 py-2 text-sm text-gray-900
          placeholder:text-gray-400
          focus:border-indigo-500 focus:bg-white
          focus:outline-none focus:ring-1 focus:ring-indigo-500
          transition
        "
      />
    </div>
  );
}
