import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ correct

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate("/"); // ✅ redirect works
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start tracking your reading habits"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input label="Name" name="name" onChange={handleChange} />
        <Input label="Email" name="email" onChange={handleChange} />
        <Input
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
        />

        <Button>Create Account</Button>
      </form>
    </AuthLayout>
  );
}
