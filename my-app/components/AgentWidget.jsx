"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AgentWidget() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    async function sendMessage() {
        if (!message.trim()) {
            return;
        }

        try {
            const res = await apiFetch("http://localhost:5000/agent", {
                method: "POST",
                body: JSON.stringify({
                    message: message,
                    calendar_id : management_id
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                return;
            }

            setResponse(data.message);
            setMessage("");
        } catch (error) {
            console.error("Agent error:", error);
        }
    }
    return (
        <>
          
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    right: "20px",
                    bottom: "20px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "25px",
                    cursor: "pointer",
                    zIndex: 1000,
                }}
            >
                🤖
            </button>

            {/* Fereastra chatului */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        right: "20px",
                        bottom: "90px",
                        width: "350px",
                        height: "450px",
                        background: "white",
                        border: "1px solid #ddd",
                        borderRadius: "15px",
                        boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            padding: "15px",
                            borderBottom: "1px solid #ddd",
                            fontWeight: "bold",
                        }}
                    >
                        AI Assistant
                    </div>

                    <div
                        style={{
                            flex: 1,
                            padding: "15px",
                        }}
                    >
                        Salut! Cu ce te pot ajuta?
                    </div>

                    <div
                        style={{
                            display: "flex",
                            padding: "10px",
                            gap: "5px",
                        }}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Scrie un mesaj..."
                            style={{
                                flex: 1,
                                padding: "10px",
                            }}
                        />

                        <button
                            onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}