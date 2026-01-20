import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("FORM DATA:", form);
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      console.log("Yes")
      navigate("/dashboard"); // placeholder route
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout 
  title="Welcome back"
  subtitle="Continue building better habits"
>
  <form onSubmit={handleSubmit} className="space-y-4">

    {error && (
      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
        {error}
      </div>
    )}

    <Input label="Email address" name="email" onChange={handleChange} />
    <Input label="Password" name="password" type="password" onChange={handleChange} />

    <Button>Sign in</Button>

    <p className="text-center text-sm text-gray-600">
      Don’t have an account?{" "}
      <a href="/register" className="font-medium text-indigo-600 hover:underline">
        Sign up
      </a>
    </p>

  </form>
</AuthLayout>

  );
}
