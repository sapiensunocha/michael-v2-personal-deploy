import { NextApiRequest, NextApiResponse } from "next";

// Define the DisasterEvent type
export interface DisasterEvent {
  id: string,
  latitude: number,
  longitude: number,
  magnitude: number | null,
  place: string,
  time: number,
  url: string,
  detailUrl: string,
  tsunami: number,
  depth: number | null,
  disaster_type: string,
  summary: string,
  risk_level: "High" | "Moderate" | "Low",
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

// Fetch and process GDACS data
const fetchGDACSData = async (): Promise<DisasterEvent[]> => {
  try {
    const response = await fetch("https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?fromdate=2024-01-01&todate=2024-12-31");
    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features
      .map((feature: any) => {
        const coords = feature.geometry?.coordinates;
        if (!coords || !Array.isArray(coords) || coords.length < 2) {
          return null;
        }

        const longitude = parseFloat(coords[0]);
        const latitude = parseFloat(coords[1]);
        if (isNaN(longitude) || isNaN(latitude)) {
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

        const id = properties.eventid?.toString() || `gdacs-${Math.random().toString(36).substring(2, 9)}`;
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
      return [];
    }

    return data.data
      .map((item: any) => {
        const longitude = parseFloat(item.longitude);
        const latitude = parseFloat(item.latitude);
        if (isNaN(longitude) || isNaN(latitude)) {
          return null;
        }

        const time = new Date(item.event_date || Date.now()).getTime();
        if (time < new Date("2023-12-31").getTime()) {
          return null;
        }

        const disasterType = item.event_type || "Unknown";
        const id = item.event_id_cnty?.toString() || `acled-${Math.random().toString(36).substring(2, 9)}`;
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
  } catch (error) {
    console.error("Error fetching ACLED data:", error);
    return [];
  }
};

// Fetch and process USGS earthquake data
const fetchUSGSData = async (): Promise<DisasterEvent[]> => {
  try {
    const response = await fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-12-31");
    const data = await response.json();

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features
      .map((feature: any) => {
        const coords = feature.geometry?.coordinates;
        if (!coords || !Array.isArray(coords) || coords.length < 3) {
          return null;
        }

        const longitude = parseFloat(coords[0]);
        const latitude = parseFloat(coords[1]);
        const depth = parseFloat(coords[2]);
        if (isNaN(longitude) || isNaN(latitude) || isNaN(depth)) {
          return null;
        }

        const properties = feature.properties || {};
        const disasterType = "Earthquake";
        const id = properties.id?.toString() || `usgs-${Math.random().toString(36).substring(2, 9)}`;
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
  } catch (error) {
    console.error("Error fetching USGS data:", error);
    return [];
  }
};

// Combine data from all sources
const unifiedDisasters = async (): Promise<DisasterEvent[]> => {
  try {
    const [gdacsData, acledData, usgsData] = await Promise.all([
      fetchGDACSData(),
      fetchACLEDData(),
      fetchUSGSData(),
    ]);

    // Combine and sort by time (descending)
    const allEvents = [...gdacsData, ...acledData, ...usgsData]
      .sort((a, b) => b.time - a.time);

    return allEvents;
  } catch (error) {
    console.error("Error combining disaster data:", error);
    return [];
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const disasterEvents = await unifiedDisasters();
    return res.status(200).json(disasterEvents);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Failed to fetch disaster data" });
  }
}