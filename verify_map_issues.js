const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

async function verifyMapIssues() {
  try {
    // Check environment variable
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    // Removed console.log for token presence

    // Load disasterData.json
    const filePath = path.resolve(__dirname, "src/data/disasterData.json");
    let localData = [];
    try {
      localData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      // Removed console.log for success
    } catch (error) {
      // Removed console.error for loading error
    }

    // Check problematic coordinates in local data
    const localProblematic = localData
      .map((d, i) => ({ index: i, id: d.id, latitude: d.latitude, longitude: d.longitude }))
      .filter(
        (d) =>
          isNaN(d.latitude) ||
          isNaN(d.longitude) ||
          typeof d.latitude !== "number" ||
          typeof d.longitude !== "number",
      );
    // Removed console.log for problematic entries

    // Fetch USGS API data
    const apiUrl =
      process.env.NEXT_PUBLIC_NASA_API_URL ||
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    let apiData = [];
    try {
      const response = await fetch(apiUrl, { headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const geojson = await response.json();
      apiData = geojson.features.map((feature, i) => ({
        index: i,
        id: feature.id,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        magnitude: feature.properties.mag,
        time: feature.properties.time,
      }));
      // Removed console.log for success
    } catch (error) {
      // Removed console.error for fetch error
    }

    // Check problematic coordinates in API data
    const apiProblematic = apiData.filter(
      (d) =>
        isNaN(d.latitude) ||
        isNaN(d.longitude) ||
        typeof d.latitude !== "number" ||
        typeof d.longitude !== "number",
    );
    // Removed console.log for problematic entries

    // Check for excessive alerts
    const recentAlerts = apiData.filter((d) => {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return d.magnitude > 2.5 && d.time >= sevenDaysAgo;
    });
    // Removed console.log for alerts count

    // Additional checks
    // You may want to handle these situations as needed (e.g. throw errors, send notifications, etc.)
    if (!localData.length && !apiData.length) {
      // No valid data - handle accordingly
    }
    if (!mapboxToken) {
      // No token - handle accordingly
    }
  } catch (error) {
    // Removed console.error for unexpected error
  }
}

verifyMapIssues();