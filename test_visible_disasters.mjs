const disasterData = [
  { latitude: 38.78, longitude: -122.74, id: "eq1" },
  { latitude: "NaN", longitude: -120.5, id: "eq2" },
  { latitude: 40.7, longitude: null, id: "eq3" },
  { latitude: 35.6, longitude: -119.1, id: "eq4" }
];

const visibleDisasters = disasterData.filter(event => {
  const lat = Number(event.latitude);
  const lon = Number(event.longitude);
  return typeof lat === "number" && !isNaN(lat) && typeof lon === "number" && !isNaN(lon);
});

console.log("Visible disasters count:", visibleDisasters.length);
console.log("Sample visible disaster:", visibleDisasters[0]);

