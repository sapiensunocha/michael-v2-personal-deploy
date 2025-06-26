// src/components/ClientMapWrapper.tsx
"use client"; // This directive marks this file as a Client Component

import dynamic from "next/dynamic";
import React from "react";

// Define the props type for the Map component (if it has specific props)
interface MapProps {
  // Add any props that the Map component expects, e.g.:
  // data?: DisasterEvent[];
}

// Dynamically import the Map component with proper typing
const DynamicMapComponent = dynamic<MapProps>(
  () => import("./Map").then((mod) => mod.default), // Ensure the default export is used
  {
    loading: () => <p>Loading map...</p>,
    ssr: false, // Disable server-side rendering
  },
);

const ClientMapWrapper: React.FC = () => {
  return <DynamicMapComponent />;
};

export default ClientMapWrapper;