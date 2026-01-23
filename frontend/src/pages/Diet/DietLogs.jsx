import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function DietLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/diet/log");
        setLogs(res.data.logs || res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading logs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Food Logs</h1>

      {logs.length === 0 ? (
        <p className="text-gray-600">No logs yet.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-xl p-4 shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">
                  {log.recipe?.title}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(log.date).toDateString()}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                🔥 {log.totalCalories} kcal
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
