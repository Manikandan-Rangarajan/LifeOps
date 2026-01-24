import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

export default function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/" || pathname === "/register";

  return (
    <div className="min-h-screen text-black-700">
      {!hideNavbar && <Navbar />}

      {/* THIS is the content surface */}
      <div className="min-h-screen bg-slate-800">
        <AppRoutes />
      </div>
    </div>
  );
}
