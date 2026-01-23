import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const { pathname } = useLocation();

  const hideNavbar =
    pathname === "/login" || pathname === "/register";

  return (
    <div className="min-h-screen bg-slate-100">
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </div>
  );
}
