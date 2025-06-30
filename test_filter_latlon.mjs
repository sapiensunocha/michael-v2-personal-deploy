const disasterData = [
  { latitude: 38.78, longitude: -122.74, id: "eq1" },
  { latitude: "NaN", longitude: -120.5, id: "eq2" },
  { latitude: 40.7, longitude: null, id: "eq3" },
  { latitude: 35.6, longitude: -119.1, id: "eq4" }
];
const visible = disasterData.filter(d => {
  const lat = Number(d.latitude);
  const lon = Number(d.longitude);
  return !isNaN(lat) && !isNaN(lon);
});
console.log("Visible disasters:", visible.length);
