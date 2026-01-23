import { useNavigate } from "react-router-dom";

export default function TasksHome() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl text-slate-400 font-bold">Tasks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Box title="Habits" onClick={() => navigate("/tasks/habits")} />
        <Box title="Planner" onClick={() => navigate("/tasks/planner")} />
        <Box title="Recurring" onClick={() => navigate("/tasks/recurring/new")} />
      </div>
    </div>
  );
}

function Box({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl text-green-300 border border-slate-700 bg-slate-800
  p-4 flex justify-between items-center hover:border-slate-900 hover:bg-green-300 hover:text-slate-900 hover:cursor-pointer"
    >
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
}
