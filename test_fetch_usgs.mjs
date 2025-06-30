fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(res => res.json())
  .then(data => { console.log("USGS fetch success. Count:", data.features.length); })
  .catch(e => console.error("USGS fetch failed:", e));
