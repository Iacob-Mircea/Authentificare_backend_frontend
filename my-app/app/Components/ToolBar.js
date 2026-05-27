"use client";

import { useRouter } from "next/navigation";


export default function ToolBar() {
  const router = useRouter();

  return (
    <div className="toolbar">
      <button className="navButton" onClick={() => router.push("/auth/register")}>
        Register
      </button>

      <button className="navButton" onClick={() => router.push("/auth/login")}>
        Login
      </button>
      
    </div>
  );
}