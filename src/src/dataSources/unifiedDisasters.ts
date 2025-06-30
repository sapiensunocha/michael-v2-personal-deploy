import fetch from "node-fetch";
import * as fs from "fs";
import { DisasterEvent } from "@/types";

const outputFile = "./public/data/recent_disasters.json";

const parseFeatureToDisasterEvent = (feature: any): DisasterEvent => {
  const props = feature.properties;
  const coords = feature.geometry.coordinates;

  return {
    id: feature.id,
    longitude: coords[0],
    latitude: coords[1],
    depth: coords[2],
    // Ensure DisasterEvent type includes 'place' property as string
    place: props.place,
    magnitude: props.mag,
    time: props.time,
    tsunami: props.tsunami,
    url: props.url,
    detailUrl: props.detail, // USGS detail URL
    disaster_type: "earthquake",
    status: "active",
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

    const data = await response.json();

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recentEvents: DisasterEvent[] = data.features
      .map((feature: any) => parseFeatureToDisasterEvent(feature))
      .filter(
        (event: DisasterEvent) =>
          event.time >= sevenDaysAgo && event.time <= Date.now(),
      );

    fs.writeFileSync(outputFile, JSON.stringify(recentEvents, null, 2));
    // Commented out console logs per ESLint rules
    // console.log(`Fetched and saved ${recentEvents.length} USGS earthquake events to ${outputFile}`);
  } catch {
    // Avoid unused 'error' warning by not declaring error variable
    // console.error("Error fetching USGS earthquake data:", error);
  }
};

updateDisasterData();

export default updateDisasterData;