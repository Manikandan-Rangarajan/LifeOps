import { useNavigate } from "react-router-dom";

const modules = [
  {
    name: "Finance",
    path: "/finance",
    description: "Income, expenses, balances & insights",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Diet",
    path: "/diet",
    description: "Meals, calories, macros & recipes",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Books",
    path: "/books",
    description: "Reading progress, sessions & stats",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Tasks",
    path: "/tasks",
    description: "Planner, reminders & recurring tasks",
    gradient: "from-purple-500 to-fuchsia-600",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-500 to-slate-800 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
          LifeOps
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 mt-3">
          Your personal management system
        </p>
      </div>

      {/* Cards */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6 sm:gap-8
      ">
        {modules.map((mod) => (
          <div
            key={mod.name}
            onClick={() => navigate(mod.path)}
            className={`
              group relative overflow-hidden
              flex flex-col items-center justify-center text-center
              rounded-3xl p-6 sm:p-10 text-white
              bg-gradient-to-br ${mod.gradient}
              cursor-pointer shadow-xl
              transition-all duration-300 ease-out
              hover:scale-[1.05] hover:shadow-2xl
              active:scale-[0.97]
            `}
          >
            {/* soft glass overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <h2 className="relative text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              {mod.name}
            </h2>

            <p className="relative text-sm sm:text-base opacity-90 mb-6 sm:mb-8 max-w-[240px] leading-relaxed">
              {mod.description}
            </p>

            {/* Arrow */}
            <div className="relative flex items-center gap-2 text-base sm:text-lg font-semibold">
              <span>Open</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
