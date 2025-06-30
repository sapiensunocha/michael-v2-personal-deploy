import { NextResponse } from "next/server";

// Define the DisasterEvent type with trend data
interface DisasterEvent {
  id: string;
  latitude: number;
  longitude: number;
  magnitude: number | null;
  place: string;
  time: number;
  url: string;
  detailUrl: string;
  tsunami: number;
  depth: number | null;
  disaster_type: string;
  summary: string;
  risk_level: "High" | "Moderate" | "Low";
  trend?: string; // New field for trend (e.g., "Increasing", "Stable", "Decreasing")
}

// Helper function to determine risk level
const getRiskLevel = (disasterType: string): "High" | "Moderate" | "Low" => {
  const typeLower = disasterType.toLowerCase();
  switch (typeLower) {
    case "earthquake":
    case "tropical cyclone":
    case "tsunami":
      return "High";
    case "flood":
    case "wildfire":
      return "Moderate";
    case "drought":
    case "violence":
    case "protests":
      return "Low";
    default:
      return "Moderate";
  }
};

// Helper function to generate summary
const generateSummary = (
  disasterType: string,
  latitude: number,
  longitude: number,
  time: number,
  magnitude: number | null,
  depth: number | null,
  status?: string,
): string => {
  return `A ${disasterType} event occurred at coordinates (${latitude.toFixed(2)}, ${longitude.toFixed(2)}) on ${new Date(time).toISOString().split("T")[0]}${magnitude ? ` with a magnitude of ${magnitude}` : ""}${depth ? ` at a depth of ${depth} km` : ""}${status ? ` (Status: ${status})` : ""}.`;
};

// Helper function to calculate trend (simplified based on event count in last 7 days)
const calculateTrend = (events: DisasterEvent[], currentTime: number): string => {
  const sevenDaysAgo = currentTime - 7 * 24 * 60 * 60 * 1000;
  const recentEvents = events.filter(e => e.time >= sevenDaysAgo).length;
  const totalEvents = events.length;
  if (recentEvents / totalEvents > 0.5) return "Increasing";
  if (recentEvents / totalEvents < 0.2) return "Decreasing";
  return "Stable";
};

// Fetch and process GDACS data
const fetchGDACSData = async (): Promise<DisasterEvent[]> => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(`https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?fromdate=${sevenDaysAgo}&todate=${today}`);
    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      console.error("GDACS data missing features or not an array");
      return [];
    }

    const events = data.features
      .map((feature: any) => {
        const coords = feature.geometry?.coordinates;
        if (!coords || !Array.isArray(coords) || coords.length < 2) {
          console.warn("Invalid GDACS coordinates:", feature);
          return null;
        }

        const longitude = parseFloat(coords[0]);
        const latitude = parseFloat(coords[1]);
        if (isNaN(longitude) || isNaN(latitude)) {
          console.warn("NaN coordinates in GDACS feature:", feature);
          return null;
        }

        const properties = feature.properties || {};
        let disasterType = properties.eventtype || "Unknown";
        switch (disasterType) {
          case "DR": disasterType = "Drought"; break;
          case "TC": disasterType = "Tropical Cyclone"; break;
          case "FL": disasterType = "Flood"; break;
          case "EQ": disasterType = "Earthquake"; break;
          case "WF": disasterType = "Wildfire"; break;
        }

        const id = `gdacs-${properties.eventid || Math.random().toString(36).substring(2, 9)}`;
        const time = new Date(properties.datemodified || Date.now()).getTime();
        const status = properties.istemporary ? "Temporary" : "Confirmed";

        return {
          id,
          latitude,
          longitude,
          magnitude: null,
          place: `${disasterType} Event`,
          time,
          url: "#",
          detailUrl: "#",
          tsunami: disasterType.toLowerCase().includes("tsunami") ? 1 : 0,
          depth: null,
          disaster_type: disasterType,
          summary: generateSummary(disasterType, latitude, longitude, time, null, null, status),
          risk_level: getRiskLevel(disasterType),
        };
      })
      .filter((event: DisasterEvent | null) => event !== null) as DisasterEvent[];

    // Calculate trend for GDACS events
    if (events.length > 0) {
      events.forEach(event => {
        event.trend = calculateTrend(events, event.time);
      });
    }
    console.log(`GDACS fetched ${events.length} events`);
    return events;
  } catch (error) {
    console.error("Error fetching GDACS data:", error);
    return [];
  }
};

// Fetch and process ACLED data
const fetchACLEDData = async (): Promise<DisasterEvent[]> => {
  try {
    const response = await fetch("https://api.acleddata.com/acled/read/?key=XB4T-5NYmfvaFASi8FKH&email=buhendwa.medi@ucbukavu.ac.cd");
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error("ACLED data missing or not an array");
      return [];
    }

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const events = data.data
      .map((item: any) => {
        const longitude = parseFloat(item.longitude);
        const latitude = parseFloat(item.latitude);
        if (isNaN(longitude) || isNaN(latitude)) {
          console.warn("NaN coordinates in ACLED item:", item);
          return null;
        }

        const time = new Date(item.event_date || Date.now()).getTime();
        if (time < sevenDaysAgo) {
          return null;
        }

        const disasterType = item.event_type || "Unknown";
        const id = `acled-${item.event_id_cnty || Math.random().toString(36).substring(2, 9)}`;
        const status = item.civilian_targeting || "Unknown";

        return {
          id,
          latitude,
          longitude,
          magnitude: null,
          place: `${disasterType} Event`,
          time,
          url: "#",
          detailUrl: "#",
          tsunami: 0,
          depth: null,
          disaster_type: disasterType,
          summary: generateSummary(disasterType, latitude, longitude, time, null, null, status),
          risk_level: getRiskLevel(disasterType),
        };
      })
      .filter((event: DisasterEvent | null) => event !== null) as DisasterEvent[];

    // Calculate trend for ACLED events
    if (events.length > 0) {
      events.forEach(event => {
        event.trend = calculateTrend(events, event.time);
      });
    }
    console.log(`ACLED fetched ${events.length} events`);
    return events;
  } catch (error) {
    console.error("Error fetching ACLED data:", error);
    return [];
  }
};

// Fetch and process USGS earthquake data
const fetchUSGSData = async (): Promise<DisasterEvent[]> => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${sevenDaysAgo}&endtime=${today}`);
    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      console.error("USGS data missing features or not an array");
      return [];
    }

    const events = data.features
      .map((feature: any) => {
        const coords = feature.geometry?.coordinates;
        if (!coords || !Array.isArray(coords) || coords.length < 3) {
          console.warn("Invalid USGS coordinates:", feature);
          return null;
        }

        const longitude = parseFloat(coords[0]);
        const latitude = parseFloat(coords[1]);
        const depth = parseFloat(coords[2]);
        if (isNaN(longitude) || isNaN(latitude) || isNaN(depth)) {
          console.warn("NaN coordinates or depth in USGS feature:", feature);
          return null;
        }

        const properties = feature.properties || {};
        const disasterType = "Earthquake";
        const id = `usgs-${properties.id || Math.random().toString(36).substring(2, 9)}`;
        const time = properties.time || Date.now();
        const magnitude = parseFloat(properties.mag) || null;
        const place = properties.place || `${disasterType} Event`;
        const tsunami = properties.tsunami || 0;

        return {
          id,
          latitude,
          longitude,
          magnitude,
          place,
          time,
          url: properties.url || "#",
          detailUrl: properties.detail || "#",
          tsunami,
          depth,
          disaster_type: disasterType,
          summary: generateSummary(disasterType, latitude, longitude, time, magnitude, depth),
          risk_level: getRiskLevel(disasterType),
        };
      })
      .filter((event: DisasterEvent | null) => event !== null) as DisasterEvent[];

    // Calculate trend for USGS events
    if (events.length > 0) {
      events.forEach(event => {
        event.trend = calculateTrend(events, event.time);
      });
    }
    console.log(`USGS fetched ${events.length} events`);
    return events;
  } catch (error) {
    console.error("Error fetching USGS data:", error);
    return [];
  }
};

// Combine data from all sources, filtering to last 7 days, with aggregated risk for hexagons
const unifiedDisasters = async (): Promise<DisasterEvent[]> => {
  try {
    const [gdacsData, acledData, usgsData] = await Promise.all([
      fetchGDACSData(),
      fetchACLEDData(),
      fetchUSGSData(),
    ]);

    // Combine, deduplicate by id (keeping most recent event), and sort by time (descending)
    const allEvents = [...gdacsData, ...acledData, ...usgsData];
    const uniqueEvents = Array.from(
      new Map(allEvents.map((event) => [event.id, event])).values(),
    ).sort((a, b) => b.time - a.time);

    // Optional: Aggregate risk for hexagon tessellation (simplified by dominant risk level per region)
    // This could be expanded with geospatial clustering later
    console.log(`Total combined events: ${allEvents.length}, Unique events: ${uniqueEvents.length}`);
    return uniqueEvents;
  } catch (error) {
    console.error("Error combining disaster data:", error);
    return [];
  }
};

export async function GET() {
  try {
    const disasterEvents = await unifiedDisasters();
    // Log IDs to check for duplicates
    const idCounts = disasterEvents.reduce((acc, event) => {
      acc[event.id] = (acc[event.id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log("Event ID counts:", idCounts);
    console.log(`Returning ${disasterEvents.length} disaster events`);
    return NextResponse.json(disasterEvents);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch disaster data" },
      { status: 500 },
    );
  }
}