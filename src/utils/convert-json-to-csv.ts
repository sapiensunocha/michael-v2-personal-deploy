export function convertToCSV(jsonData: any): string {
  // Define headers based on the new data structure
  const headers = [
    "event_id",
    "event_type",
    "event_category",
    "source",
    "start_date",
    "affected_countries",
    "coordinates",
    "state_event",
    "disaster_type",
    "impact",
    "description",
    "affected_regions",
  ];

  // Extract location coordinates as a string
  const coordinates = jsonData.extractedData.location?.coordinates
    ? jsonData.extractedData.location.coordinates.join(", ")
    : "";

  // Convert arrays to comma-separated strings
  const affectedCountries = Array.isArray(
    jsonData.extractedData.affectedCountries,
  )
    ? jsonData.extractedData.affectedCountries.join("; ")
    : jsonData.extractedData.affectedCountries || "";

  const affectedRegions = Array.isArray(
    jsonData.extractedData.gdtMetadata?.affectedRegions,
  )
    ? jsonData.extractedData.gdtMetadata.affectedRegions.join("; ")
    : jsonData.extractedData.gdtMetadata?.affectedRegions || "";

  // Create CSV row from data
  const values = [
    jsonData.extractedData.eventExternalId,
    jsonData.extractedData.eventType,
    jsonData.extractedData.eventCategory,
    jsonData.extractedData.source,
    jsonData.extractedData.startDate,
    affectedCountries,
    coordinates,
    jsonData.extractedData.gdtMetadata?.stateEvent,
    jsonData.extractedData.gdtMetadata?.disasterType,
    jsonData.extractedData.gdtMetadata?.impact,
    jsonData.extractedData.gdtMetadata?.description,
    affectedRegions,
  ].map((value) => `"${String(value || "").replace(/"/g, "\"\"")}"`); // Escape quotes, wrap in quotes, handle nulls

  // Combine headers and values
  return `${headers.join(",")}\n${values.join(",")}`;
}
