import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/books" element={<Books />} />
      <Route path="/books/:id" element={<BookDetails />} />


      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
