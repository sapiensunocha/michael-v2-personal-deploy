fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(res => res.json())
  .then(data => {
    console.log("Fetched earthquake count:", data.features.length);
    console.log("Sample earthquake:", data.features[0]);
  })
  .catch(e => console.error("Fetch failed:", e));
