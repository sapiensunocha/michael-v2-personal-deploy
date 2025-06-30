"use client";

import React from "react";

interface RightSidePanelProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  anchor?: "top-right" | "top-left";
}

const RightSidePanel: React.FC<RightSidePanelProps> = ({
  isOpen,
  onClose,
  children,
  anchor = "top-right",
}) => {
  const positionStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 3000,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    ...(anchor === "top-right" && { top: "70px", right: "10px" }),
    ...(anchor === "top-left" && { top: "70px", left: "10px" }),
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-10px)",
    pointerEvents: isOpen ? "auto" : "none",
  };

  return (
    <div
      style={{
        ...positionStyles,
        width: "340px",
        maxHeight: "660px", // Increased by 10%
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {onClose && (
        <button
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            fontSize: "1.5em",
            cursor: "pointer",
            color: "#444",
            marginBottom: "10px",
            transition: "color 0.2s ease",
          }}
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0077B6")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
        >
          ×
        </button>
      )}
      <div style={{ overflowY: "auto", paddingRight: "6px" }}>{children}</div>
    </div>
  );
};

export default RightSidePanel;