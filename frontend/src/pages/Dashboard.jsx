import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center space-y-6">
        
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>

        <p className="text-sm text-gray-600">
          Start building your reading habit
        </p>

        <button
          onClick={() => navigate("/books")}
          className="
            w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white
            hover:bg-indigo-700 transition
          "
        >
          Go to Books
        </button>

      </div>
    </div>
  );
}
