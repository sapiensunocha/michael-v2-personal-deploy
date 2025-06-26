import * as XLSX from "xlsx";

export interface DisasterEvent {
  id: string;
  longitude: number;
  latitude: number;
  place: string;
  depth?: number;
  magnitude: number;
  time: number;
  tsunami?: number;
  url?: string;
  detailUrl?: string;
  disaster_type: string;
}

const getExcelFilePath = () => {
  return "/data/Datasets.xlsx";
};

export const unifiedDisasters = async (): Promise<DisasterEvent[]> => {
  try {
    const response = await fetch(getExcelFilePath());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames.find(name => name.includes("SUM-SHEET")) || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<DisasterEvent>(worksheet);

    const disasterEvents = jsonData.map((row) => ({
      id: row.id || `event-${Math.random().toString(36).substr(2, 9)}`,
      longitude: Number(row.longitude) || 0,
      latitude: Number(row.latitude) || 0,
      place: row.place || "Unknown Location",
      depth: row.depth ? Number(row.depth) : undefined,
      magnitude: Number(row.magnitude) || 0,
      time: row.time ? new Date(row.time).getTime() : Date.now(),
      tsunami: row.tsunami ? Number(row.tsunami) : 0,
      url: row.url || "",
      detailUrl: row.detailUrl || "",
      disaster_type: row.disaster_type || "unknown",
    }));

    console.log("Fetched disaster events:", disasterEvents); // Debug log
    return disasterEvents;
  } catch (error) {
    console.error("Error processing SUM-SHEET:", error instanceof Error ? error.message : error);
    return [];
  }
};