export default function Badge({ status }) {
  const styles = {
    NOT_STARTED: "bg-gray-100 text-gray-700",
    READING: "bg-blue-100 text-blue-700",
    FINISHED: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] || styles.NOT_STARTED
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
