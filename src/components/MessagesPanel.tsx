"use client";

import React from "react";

const MessagesPanel: React.FC = () => {
  const messages = [
    { id: 1, sender: "Admin", subject: "Welcome to Disaster Map App!", snippet: "Thank you for joining our community...", time: "3 days ago" },
    { id: 2, sender: "Support", subject: "Your recent inquiry", snippet: "We are actively looking into your question...", time: "1 day ago" },
    { id: 3, sender: "Community Forum", subject: "New post: \"Earthquake Safety\"", snippet: "A new discussion about earthquake safety has started...", time: "Today" },
  ];

  const messageItemStyle: React.CSSProperties = {
    backgroundColor: "#F8F9FA",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "12px",
    cursor: "pointer",
    border: "1px solid #E0E0E0",
    transition: "background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  return (
    <div style={{ padding: "10px", overflowY: "auto", height: "100%", width: "320px" }}>
      {messages.length === 0 ? (
        <p style={{ color: "#6B7280", textAlign: "center", marginTop: "20px", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "0.95em" }}>No new messages.</p>
      ) : (
        messages.map(msg => (
          <div
            key={msg.id}
            style={messageItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E9ECEF"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F8F9FA"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; }}
            onClick={() => alert(`Opening message from ${msg.sender}: ${msg.subject}`)}
          >
            <p style={{ margin: 0, fontSize: "1em", fontWeight: "500", color: "#333333", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              {msg.sender}: {msg.subject}
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "0.9em", color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              {msg.snippet}
            </p>
            <small style={{ color: "#6B7280", fontSize: "0.85em", textAlign: "right", display: "block", marginTop: "5px", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{msg.time}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesPanel;