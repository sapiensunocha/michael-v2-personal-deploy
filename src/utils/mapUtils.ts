// src/utils/mapUtils.ts

/**
 * Performs reverse geocoding using OpenStreetMap Nominatim API.
 * @param lat Latitude
 * @param lon Longitude
 * @returns A promise that resolves to the formatted address string or "Unknown location".
 */
export async function reverseGeocodeNominatim(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.display_name || "Unknown location";
  } catch (error) {
    console.error("Error during reverse geocoding:", error);
    return "Failed to get address";
  }
}

/**
 * Performs forward geocoding (address search) using OpenStreetMap Nominatim API.
 * @param query The address or place name to search for.
 * @returns A promise that resolves to an array of location results (lat, lon, display_name).
 */
export async function forwardGeocodeNominatim(query: string): Promise<Array<{ lat: number; lon: number; address: string }>> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      address: item.display_name,
    }));
  } catch (error) {
    console.error("Error during forward geocoding:", error);
    return [];
  }
}