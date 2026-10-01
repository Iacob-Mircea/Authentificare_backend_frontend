"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AgentWidget({ onCalendarChange }) {
    const [open, setOpen] = useState(false);

    // Textul pe care îl scrii acum în input
    const [message, setMessage] = useState("");

    // Mesajele afișate în conversație
    const [messages, setMessages] = useState([]);


    async function sendMessage() {
        if (!message.trim()) {
            return;
        }

        const userMessage = message.trim();

        // Adăugăm mesajul utilizatorului în conversație
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ]);

        // Golim input-ul
        setMessage("");

        try {
            const res = await apiFetch("/agent/agent", {
                method: "POST",
                body: JSON.stringify({
                    message: userMessage,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.error(data);
                return;
            }
            
            // Adăugăm răspunsul agentului în conversație
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data[0].response,
                },
            ]);
            if(data[0].calendar_change === true){
                console.log("CALENDAR SHOULD REFRESH");
                onCalendarChange;
            }
        } catch (error) {
            console.error("Agent error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "A apărut o eroare la comunicarea cu agentul.",
                },
            ]);
        }
    }

    return (
        <>
            {/* Butonul robot */}
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
                    {/* Header */}
                    <div
                        style={{
                            padding: "15px",
                            borderBottom: "1px solid #ddd",
                            fontWeight: "bold",
                        }}
                    >
                        AI Assistant
                    </div>

                    {/* Mesajele */}
                    <div
                        style={{
                            flex: 1,
                            padding: "15px",
                            overflowY: "auto",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    textAlign:
                                        msg.role === "user"
                                            ? "right"
                                            : "left",
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        background:
                                            msg.role === "user"
                                                ? "#2563eb"
                                                : "#f1f1f1",
                                        color:
                                            msg.role === "user"
                                                ? "white"
                                                : "black",
                                        maxWidth: "80%",
                                    }}
                                >
                                    {msg.content}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            display: "flex",
                            padding: "10px",
                            gap: "5px",
                            borderTop: "1px solid #ddd",
                        }}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                            placeholder="Scrie un mesaj..."
                            style={{
                                flex: 1,
                                padding: "10px",
                            }}
                        />

                        <button onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}