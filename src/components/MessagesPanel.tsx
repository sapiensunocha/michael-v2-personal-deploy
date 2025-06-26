// src/components/MessagesPanel.tsx
"use client";

import React from "react";

const MessagesPanel: React.FC = () => {
  // Mock messages data
  const messages = [
    { id: 1, sender: "Admin", subject: "Welcome to Disaster Map App!", snippet: "Thank you for joining our community...", time: "3 days ago" },
    { id: 2, sender: "Support", subject: "Your recent inquiry", snippet: "We are actively looking into your question...", time: "1 day ago" },
    { id: 3, sender: "Community Forum", subject: "New post: \"Earthquake Safety\"", snippet: "A new discussion about earthquake safety has started...", time: "Today" },
  ];

  const messageItemStyle: React.CSSProperties = {
    backgroundColor: "rgba(40, 40, 40, 0.8)",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  };

  return (
    <div style={{ paddingBottom: "20px" }}>
      <p style={{ fontSize: "0.9em", color: "#A0A0A0", marginBottom: "20px" }}>
        Your direct messages and communications.
      </p>

      {messages.length === 0 ? (
        <p style={{ color: "#A0A0A0", textAlign: "center", marginTop: "50px" }}>No new messages.</p>
      ) : (
        messages.map(msg => (
          <div
            key={msg.id}
            style={messageItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(60, 60, 60, 0.9)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(40, 40, 40, 0.8)")}
            onClick={() => alert(`Opening message from ${msg.sender}: ${msg.subject}`)}
          >
            <p style={{ margin: 0, fontSize: "1em", fontWeight: "bold", color: "#E0E0E0" }}>
              {msg.sender}: {msg.subject}
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "0.9em", color: "#A0A0A0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {msg.snippet}
            </p>
            <small style={{ color: "#A0A0A0", fontSize: "0.85em", textAlign: "right", display: "block", marginTop: "5px" }}>{msg.time}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesPanel;