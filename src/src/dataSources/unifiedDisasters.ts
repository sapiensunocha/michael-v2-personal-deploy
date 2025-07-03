import fetch from "node-fetch";
import * as fs from "fs";
import { DisasterEvent } from "@/types";

const outputFile = "./public/data/recent_disasters.json";

// Add a minimal interface for the USGS GeoJSON response structure
interface UsgsGeoJson {
  features: {
    properties: {
      mag: number;
      place: string;
      time: number;
      tsunami: number;
      url: string;
      detail: string;
      status: string;
      title: string;
      depth: number;
    };
    geometry: {
      coordinates: [number, number, number]; // [longitude, latitude, elevation/depth]
    };
    id: string;
  }[];
}

// Helper function to determine risk level based on magnitude
const getRiskLevel = (magnitude: number | null): DisasterEvent['risk_level'] => {
  if (magnitude === null) return "Low";
  if (magnitude >= 7) {
    return "High";
  } else if (magnitude >= 5) {
    return "Moderate";
  } else {
    return "Low";
  }
};

const parseFeatureToDisasterEvent = (feature: any): DisasterEvent => {
  const props = feature.properties;
  const coords = feature.geometry.coordinates;

  const magnitude = typeof props.mag === 'number' ? props.mag : null;
  const depth = typeof props.depth === 'number' ? props.depth : null;

  return {
    id: feature.id,
    longitude: coords[0],
    latitude: coords[1],
    depth: depth,
    place: props.place || "Unknown Location",
    magnitude: magnitude,
    time: props.time,
    tsunami: props.tsunami,
    url: props.url,
    detailUrl: props.detail,
    disaster_type: "earthquake",
    status: props.status || "reported",
    summary: props.title || `Magnitude ${magnitude || 'N/A'} - ${props.place || 'Unknown Location'}`,
    risk_level: getRiskLevel(magnitude),
  };
};

const updateDisasterData = async (): Promise<void> => {
  try {
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
    );

    if (!response.ok) {
      throw new Error(`USGS fetch error: ${response.statusText}`);
    }

    // --- FIX START ---
    // Assert the type of 'data' after parsing JSON
    const data = (await response.json()) as UsgsGeoJson;
    // --- FIX END ---

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentEvents: DisasterEvent[] = data.features
      .map((feature: any) => parseFeatureToDisasterEvent(feature))
      .filter(
        (event: DisasterEvent) =>
          event.time >= sevenDaysAgo && event.time <= Date.now(),
      );

    fs.writeFileSync(outputFile, JSON.stringify(recentEvents, null, 2));
    // console.log(`Fetched and saved ${recentEvents.length} USGS earthquake events to ${outputFile}`);
  } catch (error) {
    console.error("Error fetching USGS earthquake data:", error);
  }
};

updateDisasterData();

export default updateDisasterData;