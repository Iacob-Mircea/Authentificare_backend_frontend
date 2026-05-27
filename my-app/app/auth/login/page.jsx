"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const result = await login(formData);

      if (!result.ok) {
        setMessage(result.data.message || "Login failed");
        return;
      }

      setMessage("Login successful");
      router.push("/calendar");
    } catch (error) {
      setMessage("Server error");
      console.error(error);
    }
  }

  return (
    <div className="loginPage">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="loginForm">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
      <p className="loginRedirect">
        Nu ai cont? <Link href="/auth/register">Register</Link>
      </p>
    </div>
  );
}
