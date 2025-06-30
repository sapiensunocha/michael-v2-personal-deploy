import { readFile } from "xlsx";
import path from "path";

const filePath = path.join(process.cwd(), "src", "dataSources", "Datasets.xlsx");
try {
  const workbook = readFile(filePath);
  console.log("Sheet names in Datasets.xlsx:", workbook.SheetNames);
} catch (error) {
  console.error("Error reading Excel file:", error.message);
}
