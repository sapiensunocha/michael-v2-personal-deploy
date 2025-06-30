const xlsx = require("xlsx");
const path = require("path");
const filePath = path.join(process.cwd(), "src", "dataSources", "Datasets.xlsx");
try {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const headers = jsonData[0];
  console.log("Column names in Datasets.xlsx:", headers);
  const expectedColumns = ["id", "latitude", "longitude", "disaster_type", "depth", "magnitude", "status", "time"];
  const missingColumns = expectedColumns.filter(col => !headers.includes(col));
  const extraColumns = headers.filter(col => !expectedColumns.includes(col));
  if (missingColumns.length > 0) {
    console.warn("Missing expected columns:", missingColumns);
  }
  if (extraColumns.length > 0) {
    console.log("Extra columns found:", extraColumns);
  }
  if (missingColumns.length === 0 && extraColumns.length === 0) {
    console.log("All expected columns are present and no extra columns found.");
  }
} catch (error) {
  console.error("Error reading Excel file:", error.message);
}
