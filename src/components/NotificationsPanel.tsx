// src/components/NotificationsPanel.tsx
import React from "react";

interface Alert {
  id: string;
  type: string;
  title: string;
  time: number;
  link?: string;
}

interface NotificationsPanelProps {
  alerts: Alert[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ alerts }) => {
  const panelStyle: React.CSSProperties = {
    fontFamily: "\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
    color: "#E0E0E0",
    lineHeight: "1.6",
    padding: "20px",
  };

  const alertItemStyle: React.CSSProperties = {
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    borderLeft: "4px solid #007bff",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  };

  const alertTitleStyle: React.CSSProperties = {
    margin: "0 0 5px 0",
    fontSize: "1.1em",
    fontWeight: "bold",
    color: "#88ccff",
  };

  const alertTimestampStyle: React.CSSProperties = {
    fontSize: "0.85em",
    color: "#A0A0A0",
    marginBottom: "8px",
  };

  const alertLinkStyle: React.CSSProperties = {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "0.9em",
  };

  return (
    <div style={panelStyle}>
      <h2
        style={{
          color: "#E0E0E0",
          marginBottom: "25px",
          borderBottom: "1px solid #444",
          paddingBottom: "10px",
        }}
      >
        Recent Alerts
      </h2>
      {alerts.length === 0 ? (
        <p style={{ color: "#A0A0A0" }}>No recent alerts.</p>
      ) : (
        alerts.map((alert) => (
          <div key={alert.id} style={alertItemStyle}>
            <p style={alertTitleStyle}>{alert.title}</p>
            <p style={alertTimestampStyle}>{new Date(alert.time).toLocaleString()}</p>
            <p>{alert.type}</p>
            {alert.link && (
              <a
                href={alert.link}
                target="_blank"
                rel="noopener noreferrer"
                style={alertLinkStyle}
              >
                View Details
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPanel;