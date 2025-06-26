import { NextApiRequest, NextApiResponse } from "next";
import XLSX from "xlsx";
import path from "path";

export interface DisasterEvent {
  id: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  place: string;
  time: number;
  url: string;
  detailUrl: string;
  tsunami: number;
  depth: number;
  disaster_type: string;
}

const unifiedDisasters = async (): Promise<DisasterEvent[]> => {
  try {
    const EXCEL_FILE_PATH = path.join(process.cwd(), "src/dataSources/Datasets.xlsx");
    console.log("Reading Excel file from:", EXCEL_FILE_PATH); // Debug log
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const sheet = workbook.Sheets["SUM-SHEET"];

    if (!sheet) {
      console.error("SUM-SHEET not found in the Excel file");
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log("Raw sheet data:", data); // Debug log

    const disasterEvents: DisasterEvent[] = data.slice(1).map((row: any) => {
      const [
        id,
        longitude,
        latitude,
        disaster_type,
        depth,
        magnitude,
        status,
        time,
        bbox,
        filename,
      ] = row;

      return {
        id: id?.toString() || `sheet-${Math.random().toString(36).substring(2, 9)}`,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        magnitude: parseFloat(magnitude) || 0,
        place: disaster_type
          ? `${disaster_type.charAt(0).toUpperCase() + disaster_type.slice(1)} Event`
          : "Unknown Event",
        time: typeof time === "number" ? time : new Date(time).getTime() || Date.now(),
        url: filename ? `/files/${filename}` : "#",
        detailUrl: filename ? `/details/${filename}` : "#",
        tsunami: disaster_type?.toLowerCase().includes("tsunami") ? 1 : 0,
        depth: parseFloat(depth) || 0,
        disaster_type: disaster_type?.toString() || "Unknown",
      };
    }).filter(event => 
      !isNaN(event.latitude) && 
      !isNaN(event.longitude) && 
      event.disaster_type,
    );

    console.log("Processed disaster events:", disasterEvents); // Debug log
    return disasterEvents;
  } catch (error) {
    console.error("Error reading SUM-SHEET:", error);
    return [];
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const disasterEvents = await unifiedDisasters();
    res.status(200).json(disasterEvents);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to fetch disaster data" });
  }
}