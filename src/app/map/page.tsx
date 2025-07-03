import { DisasterEvent } from "../../types";
import MapClientDynamic from "./MapClientDynamic";

const fetchEarthquakeData = async (): Promise<DisasterEvent[]> => {
  try {
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
      { cache: "no-store" },
    );
    const geojson = await response.json();

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return geojson.features
      .filter((feature: any) => {
        const eventTime = feature.properties.time;
        return (
          eventTime >= sevenDaysAgo &&
          eventTime <= Date.now() &&
          feature.properties.mag > 2.5
        );
      })
      .map((feature: any) => ({
        id: feature.id || `usgs-${Math.random().toString(36).substring(2, 9)}`,
        latitude: feature.geometry.coordinates[1] || 0,
        longitude: feature.geometry.coordinates[0] || 0,
        magnitude: feature.properties.mag || 0,
        place: feature.properties.place || "Unknown Location",
        time: feature.properties.time || Date.now(),
        url: feature.properties.url || "#",
        detailUrl: feature.properties.detail || "#",
        tsunami: feature.properties.tsunami || 0,
        depth: feature.geometry.coordinates[2] || 0,
        disaster_type: feature.properties.type || "earthquake",
        status: feature.properties.status || "reviewed",
      }));
  } catch {
    return [];
  }
};

export default async function Page() {
  const recentData = await fetchEarthquakeData();

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <MapClientDynamic initialData={recentData} />
    </div>
  );
}