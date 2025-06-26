// src/app/map/page.tsx
import React from "react";
import ClientMapWrapper from "../../components/ClientMapWrapper"; // Import the new client wrapper

const MapPage = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      {/* REMOVED: The <h1>Disaster Map</h1> heading, as requested, to clean up the display. */}
      <div style={{ flexGrow: 1 }}> {/* Make the map container take available space */}
        {/* Render the client wrapper which internally handles the dynamic map import */}
        <ClientMapWrapper />
      </div>
    </div>
  );
};

export default MapPage;