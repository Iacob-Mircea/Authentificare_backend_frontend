"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
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
      const response = await registerUser(formData);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Register failed");
        return;
      }

      setMessage("Account created successfully");
      router.push("/auth/login");
    } catch (error) {
      setMessage("Server error");
      console.error(error);
    }
  }

  return (
    <div className="registerPage">
      <h1>Register</h1>

      <form onSubmit={handleSubmit} className="registerForm">
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

        <button type="submit">Create account</button>
      </form>

      {message && <p>{message}</p>}
      <p className="loginRedirect">
        Ai deja cont? <Link href="/auth/login">Login</Link>
      </p>
    </div>
  );
}
