"use client";

import ClientMapWrapper from "../../components/ClientMapWrapper";
import { DisasterEvent } from "../../types";
import useDisasterStore from "../../zustand/features/disasterDataStore";
import { useEffect } from "react";
// Add these imports for the chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Add this registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  initialData: DisasterEvent[];
}

export default function MapClient({ initialData }: Props) {
  const setDisasterData = useDisasterStore((state) => state.setDisasterData);

  useEffect(() => {
    const transformed = initialData.map((event) => ({
      id: event.id || "",
      title: "Untitled", // default since DisasterEvent has no "title"
      location: {
        lat: event.latitude,
        lng: event.longitude,
      },
      severity: "moderate",
      type: "earthquake", // or use logic if you have it
      affectedArea: "Unknown", // default fallback
      date: new Date(event.time).toISOString(),
      description: "No description available", // default fallback
    }));

    setDisasterData("earthquakes", transformed);
  }, [initialData, setDisasterData]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* ✅ Use next/image instead of <img> for performance */}
      { }
      <ClientMapWrapper initialData={initialData} />
    </div>
  );
}