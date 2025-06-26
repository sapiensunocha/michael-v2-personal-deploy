// src/components/RightSidePanel.tsx
"use client";

import React from "react";

interface RightSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const RightSidePanel: React.FC<RightSidePanelProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : "-400px", // Slide in from right (panel width is 400px)
        width: "400px", // Fixed width for the panel
        height: "100%",
        backgroundColor: "#1a1a1a", // Dark background
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        zIndex: 3000, // Higher than other map elements
        transition: "right 0.3s ease-in-out", // Smooth slide animation
        display: "flex",
        flexDirection: "column",
        fontFamily: "\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        color: "#E0E0E0",
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.5em", color: "#88ccff", fontWeight: "600" }}>
          {title}
        </h2>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#E0E0E0",
            fontSize: "1.8em",
            cursor: "pointer",
            transition: "color 0.2s ease-in-out",
            lineHeight: "1",
          }}
        >
          &times;
        </button>
      </div>

      {/* Panel Content Area */}
      <div
        style={{
          flexGrow: 1, // Takes up remaining space
          overflowY: "auto", // Scroll if content overflows
          padding: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default RightSidePanel;