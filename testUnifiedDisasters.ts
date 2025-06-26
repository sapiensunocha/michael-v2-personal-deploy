import * as XLSX from "xlsx";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DisasterEvent {
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

const getExcelFilePath = () => path.resolve(__dirname, "public/data/Datasets.xlsx");

const unifiedDisasters = async () => {
  try {
    console.log("Reading file from:", getExcelFilePath());
    const buffer = await fs.readFile(getExcelFilePath());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames.find(name => name.includes("SUM-SHEET")) || workbook.SheetNames[0];
    console.log("Using sheet:", sheetName);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
    console.log("Raw data:", jsonData);
    const disasterEvents = jsonData.map((row: Record<string, any>) => ({
      id: row.id || `event-${Math.random().toString(36).substr(2, 9)}`,
      longitude: Number(row.longitude) || 0,
      latitude: Number(row.latitude) || 0,
      place: row.place || "Unknown",
      depth: row.depth ? Number(row.depth) : undefined,
      magnitude: Number(row.magnitude) || 0,
      time: row.time ? new Date(row.time).getTime() : Date.now(),
      tsunami: row.tsunami ? Number(row.tsunami) : 0,
      url: row.url || "",
      detailUrl: row.detailUrl || "",
      disaster_type: row.disaster_type || "unknown",
    }));
    console.log("Processed data:", disasterEvents);
    return disasterEvents;
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    return [];
  }
};

(async () => {
  const data = await unifiedDisasters();
  console.log("Data length:", data.length);
  if (data.length === 0) console.log("Issue: No data - check file path, existence, or content.");
})();