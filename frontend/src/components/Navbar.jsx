import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-8">
      <div className="flex gap-8">
        <NavItem to="/home" label="Home" />
        <NavItem to="/diet" label="Diet" />
        <NavItem to="/books" label="Books" />
        <NavItem to="/tasks" label="Tasks" />
        <NavItem to="/finance" label="Finance" />
      </div>
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        text-sm font-medium tracking-wide transition
        ${
          isActive
            ? "text-emerald-400"
            : "text-slate-400 hover:text-white"
        }
        `
      }
    >
      {label}
    </NavLink>
  );
}
