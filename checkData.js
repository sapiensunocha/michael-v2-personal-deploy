const XLSX = require("xlsx");
const path = "./src/dataSources/Datasets.xlsx";
try {
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets["SUM-SHEET"];
  if (!sheet) {
    console.error("SUM-SHEET not found");
    process.exit(1);
  }
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  console.log("First 10 rows:", JSON.stringify(data.slice(0, 10), null, 2));
} catch (e) {
  console.error("Error:", e.message);
}