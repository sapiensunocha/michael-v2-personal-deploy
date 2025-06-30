fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(res => res.json())
  .then(data => {
    console.log("Fetched features count:", data.features.length);
    const earthquakes = data.features.map(f => ({
      id: f.id,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      mag: f.properties.mag,
      place: f.properties.place
    }));
    console.log("Sample earthquake:", earthquakes[0]);
  })
  .catch(e => console.error("Fetch failed:", e));
