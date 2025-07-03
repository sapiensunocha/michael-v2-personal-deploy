"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image"; // Use next/image instead of img for better optimization
import { DisasterEvent } from "@/types";

interface MapProps {
  data: DisasterEvent[];
}

interface ClientMapWrapperProps {
  initialData: DisasterEvent[];
}

const MapComponent = dynamic<MapProps>(() => import("./Map/index").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const ClientMapWrapper: React.FC<ClientMapWrapperProps> = ({ initialData }) => {
  const [disasterData] = useState<DisasterEvent[]>(initialData);

  useEffect(() => {
    console.log("✅ Loaded initial disaster data:", disasterData);
  }, [disasterData]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Image
        src="/icons/logoMichael.png"
        alt="Logo"
        width={50}
        height={50} // Adjusted to maintain aspect ratio
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      />
      <MapComponent data={disasterData} />
    </div>
  );
};

export default ClientMapWrapper;