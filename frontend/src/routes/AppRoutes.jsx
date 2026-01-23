import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";
import Home from "../pages/Home";
import AddRecipe from "../pages/Diet/AddRecipe";
import DietHome from "../pages/Diet/DietHome";
import RecipeDetail from "../pages/Diet/RecipeDetail";
import DietLogs from "../pages/Diet/DietLogs";
import AddDietLog from "../pages/Diet/AddDietLog";
import DietSummary from "../pages/Diet/DietSummary";
import AddFoodLog from "../pages/Diet/AddFoodlogs";
import Accounts from "../pages/Finance/Accounts";
import AddTransaction from "../pages/Finance/AddTransaction";
import FinanceSummary from "../pages/Finance/FinanceSummary";
import Transactions from "../pages/Finance/Transactions";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Books */}
      <Route path="/books" element={<Books />} />
      <Route path="/books/:id" element={<BookDetails />} />
      {/* Diet */}
      <Route path="/diet/recipes" element={<DietHome />} />
      <Route path="/diet/new" element={<AddRecipe />} />
      <Route path="/diet/" element={<DietSummary />} />
      <Route path="/diet/log/new" element={<AddFoodLog />} />
      <Route path="/diet/recipe/:id" element={<RecipeDetail />} />
      {/* Finance */}
      <Route path="/finance" element={<FinanceSummary />} />
      <Route path="/finance/transactions" element={<Transactions />} />
      <Route path="/finance/transactions/new" element={<AddTransaction />} />
      <Route path="/finance/accounts" element={<Accounts />} />


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
