import fs from "fs/promises";
import path from "path";
fs.access(path.join(process.cwd(), "src", "dataSources", "Datasets.xlsx"))
  .then(() => console.log("Yes"))
  .catch(() => console.log("No"));
