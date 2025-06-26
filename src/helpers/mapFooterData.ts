import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
const CONFLICT_API_URL = `${API_BASE_URL}/event/list?withPagination=true&page=1&limit=2000`;
const VOLCANOES_API_URL = `${API_BASE_URL}/event/list?eventType=VO`;
const WILDFIRES_API_URL = `${API_BASE_URL}/event/list?eventType=WF`;
const EARTHQUAKE_API_URL = `${API_BASE_URL}/event/list?eventType=EQ`;
const DROUGHT_API_URL = `${API_BASE_URL}/event/list?eventType=DR`;
const FLOOD_API_URL = `${API_BASE_URL}/event/list?eventType=FL`;
const TECHNOLOGICAL_API_URL = `${API_BASE_URL}/event/list?eventType=TE`;
const TROPICAL_CYCLONE_API_URL = `${API_BASE_URL}/event/list?eventType=TC`;

const fetchEvents = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data");
  const data = await response.json();
  return data?.data || [];
};

const mapAndLimitData = (data: any[], mapper: (item: any) => any) => {
  return data?.slice(0, 80).map(mapper);
};

const eventMapper = (item: any) => ({
  id: item.rawData.properties.eventid,
  title: item.rawData.properties.name,
  location: {
    lng: parseFloat(item.rawData.bbox[0]),
    lat: parseFloat(item.rawData.bbox[1]),
  },
  severity: item.rawData.properties.alertlevel || "unknown",
  type: item.rawData.properties.eventtype,
  affectedArea: item.rawData.properties.country,
  description: item.rawData.properties?.htmldescription,
  date: item.rawData.properties.todate,
});

const locationToAvoidMapper = (item: any) => (
  {
    lng: parseFloat(item.rawData.location[1]),
    lat: parseFloat(item.rawData.location[0]),
  }
);

const useLocationToAvoid = () => {
  return useQuery({
    queryKey: ["location-to-avoid"],
    queryFn: () => fetchEvents(CONFLICT_API_URL),
    select: (data) => mapAndLimitData(data, locationToAvoidMapper),
  });
};

const techEventMapper = (item: any) => ({
  id: item._id,
  title: item.rawData.type_of_disaster,
  location: {
    lng: parseFloat(item.rawData.location[1]),
    lat: parseFloat(item.rawData.location[0]),
  },
  severity: item.rawData.event_state || "unknown",
  type: "TE",
  affectedArea: item.rawData.affected_region,
  description: item.rawData.description,
  date: item.rawData.date_and_time,
});

const useTropicalCycloneData = () => {
  return useQuery({
    queryKey: ["tropical-cyclone-events"],
    queryFn: () => fetchEvents(TROPICAL_CYCLONE_API_URL),
    select: (data) => mapAndLimitData(data, eventMapper),
  });
}
;
const useTechnologicalData = () => {
  return useQuery({
    queryKey: ["technological-events"],
    queryFn: () => fetchEvents(TECHNOLOGICAL_API_URL),
    select: (data) => mapAndLimitData(data, techEventMapper),
  });
};

const useFloodData = () => {
  return useQuery({
    queryKey: ["flood-events"],
    queryFn: () => fetchEvents(FLOOD_API_URL),
    select: (data) => mapAndLimitData(data, eventMapper),
  });
};

const useDroughtData = () => {
  return useQuery({
    queryKey: ["drought-events"],
    queryFn: () => fetchEvents(DROUGHT_API_URL),
    select: (data) => mapAndLimitData(data, eventMapper),
  });
};

const useEarthquakesData = () => {
  return useQuery({
    queryKey: ["earthquake-events"],
    queryFn: () => fetchEvents(EARTHQUAKE_API_URL),
    select: (data) => mapAndLimitData(data, eventMapper),
  });
};

const useWildfiresData = () => {
  return useQuery({
    queryKey: ["wildfire-events"],
    queryFn: () => fetchEvents(WILDFIRES_API_URL),
    select: (data) => mapAndLimitData(data, eventMapper),
  });
};

const useVolcanoesData = () => {
  return useQuery({
    queryKey: ["volcano-events"],
    queryFn: () => fetchEvents(VOLCANOES_API_URL),
    select: (data) => mapAndLimitData(data, eventMapper),
  });
};

const useConflictData = () => {
  return useQuery({
    queryKey: ["conflict-events"],
    queryFn: () => fetchEvents(CONFLICT_API_URL),
    select: (data) => {
      const filteredData = data.filter(
        (item: any) =>
          new Date(item.rawData.event_date) > new Date("2025-02-06") && item.rawData?.event_type !== "Strategic developments",
      );
      return mapAndLimitData(filteredData, (item: any) => ({
        id: item._id,
        title: item.rawData.disorder_type,
        location: {
          lng: parseFloat(item.rawData.longitude),
          lat: parseFloat(item.rawData.latitude),
        },
        severity: "unknown",
        type: "conflicts",
        affectedArea: [item.rawData.region, item.rawData.country].join(", "),
        description:
          item.rawData?.description ||
          item.rawData.notes ||
          "No description available",
        date: item.rawData.event_date,
      }));
    },
  });
};

const useConflictDevelopmentData = () => {
  return useQuery({
    queryKey: ["conflict-development-events"],
    queryFn: () => fetchEvents(CONFLICT_API_URL),
    select: (data) => {
      const filteredData = data.filter(
        (item: any) => item.rawData?.event_type === "Strategic developments",
      );
      return mapAndLimitData(filteredData, (item: any) => ({
        id: item._id,
        title: item.rawData.disorder_type,
        location: {
          lng: parseFloat(item.rawData.longitude),
          lat: parseFloat(item.rawData.latitude),
        },
        severity: "unknown",
        type: "developments",
        affectedArea: [item.rawData.region, item.rawData.country].join(", "),
        description:
          item.rawData?.description ||
          item.rawData.notes ||
          "No description available",
        date: item.rawData.event_date,
      }));
    },
  });
};

export {
  useConflictData,
  useConflictDevelopmentData,
  useDroughtData,
  useEarthquakesData,
  useFloodData,
  useTechnologicalData,
  useVolcanoesData,
  useWildfiresData,
  useTropicalCycloneData,
  useLocationToAvoid, techEventMapper,
};
