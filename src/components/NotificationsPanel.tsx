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
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#333333",
    lineHeight: "1.6",
    padding: "20px",
    height: "calc(100% - 60px)",
    overflowY: "auto",
  };

  const alertItemStyle: React.CSSProperties = {
    backgroundColor: "#F8F9FA",
    borderLeft: "4px solid #0077B6",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "15px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const alertTitleStyle: React.CSSProperties = {
    margin: "0 0 5px 0",
    fontSize: "1.1em",
    fontWeight: "500",
    color: "#0077B6",
  };

  const alertTimestampStyle: React.CSSProperties = {
    fontSize: "0.85em",
    color: "#6B7280",
    marginBottom: "8px",
  };

  const alertLinkStyle: React.CSSProperties = {
    color: "#0077B6",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.9em",
    transition: "color 0.2s ease",
  };

  return (
    <div style={panelStyle}>
      <h2
        style={{
          color: "#333333",
          marginBottom: "25px",
          borderBottom: "1px solid #E0E0E0",
          paddingBottom: "10px",
          fontSize: "1.5em",
          fontWeight: "600",
        }}
      >
        Recent Alerts
      </h2>
      {alerts.length === 0 ? (
        <p style={{ color: "#6B7280", textAlign: "center", marginTop: "50px" }}>No recent alerts.</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            style={alertItemStyle}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(5px)"; e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)"; }}
          >
            <p style={alertTitleStyle}>{alert.title}</p>
            <p style={alertTimestampStyle}>{new Date(alert.time).toLocaleString()}</p>
            <p style={{ color: "#6B7280", fontSize: "0.95em" }}>{alert.type}</p>
            {alert.link && (
              <a
                href={alert.link}
                target="_blank"
                rel="noopener noreferrer"
                style={alertLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#005A8A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#0077B6")}
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