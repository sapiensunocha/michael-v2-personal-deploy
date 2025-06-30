// src/components/EventDetailsPanel.tsx

import * as React from "react";
import { DisasterEvent } from "@/types";
import styled from "styled-components";

// This is a placeholder for your chart library.
// You need to install a library like "chart.js" or "recharts"
// import { Line } from "react-chartjs-2"; 
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PanelContainer = styled.div`
    width: 350px; 
    padding: 16px; 
    background: #fff; 
    border-right: 1px solid #e0e0e0; 
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    z-index: 1000;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;

interface EventDetailsPanelProps {
  event: DisasterEvent;
  onClose: () => void;
}

const EventDetailsPanel: React.FC<EventDetailsPanelProps> = ({ event, onClose }) => {
  return (
    <PanelContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: 0, fontSize: "18px" }}>{event.disaster_type} forecast</h3>
            <div style={{ height: "250px", width: "100%", background: "#f8f8f8", border: "1px solid #ddd", borderRadius: "8px", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#888", fontStyle: "italic" }}>Graph component goes here</p>
            </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#005A8A", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Event Information</h4>
            <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                <p><strong>Summary:</strong> {event.summary}</p>
                <p><strong>Risk Level:</strong> {event.risk_level}</p>
                <p><strong>Time:</strong> {new Date(event.time).toLocaleString()}</p>
                <p><strong>Magnitude:</strong> {event.magnitude ?? "N/A"}</p>
                <p><strong>Depth:</strong> {event.depth ? `${event.depth} km` : "N/A"}</p>
                <a href={event.url} target="_blank" rel="noopener noreferrer">More Info</a>
            </div>
        </div>
    </PanelContainer>
  );
};

export default EventDetailsPanel;