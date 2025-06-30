"use client";

import dynamic from "next/dynamic";
import { DisasterEvent } from "../../types";

interface Props {
  initialData: DisasterEvent[];
}

// Dynamically import MapClient to disable SSR
const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <p>Loading map...</p>
    </div>
  ),
});

export default function MapClientDynamic({ initialData }: Props) {
  return <MapClient initialData={initialData} />;
}