export interface DisasterEvent {
  url: string;
  time: string;
  people_affected: number;
  disaster: string;
  location: string;
  people_supported?: number;
  organizations?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  severity?: string;
  magnitude?: number;
  type?: string;
  description?: string;
  affectedArea?: string;
}

export interface DisasterStats {
  total_events?: number;
  total_affected?: number;
  total_funding?: number;
  locations: Record<string, any>;
  disaster_types?: Record<string, number>;
  sources?: Record<string, number>;
  last_updated?: string;
  error?: string;
  message?: string;
}

const API_BASE_URL = "https://global-data-scraping.onrender.com";
const CACHE_TTL = 3600; // Cache for 1 hour

export async function fetchDisasterEvents(country?: string): Promise<DisasterEvent[]> {
  try {
    const endpoint = country 
      ? `${API_BASE_URL}/disasters/by_country/${encodeURIComponent(country)}`
      : `${API_BASE_URL}/people/stats`;
    
    console.log("Fetching disaster events from:", endpoint); // Debug log
    const response = await fetch(endpoint, {
      headers: { "accept": "application/json" },
      next: { revalidate: CACHE_TTL }, // Next.js caching
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data = await response.json();
    
    const events = country ? data : Object.entries(data.by_location).map(([location, stats]: [string, any]) => ({
      url: data.source_urls_processed?.[0] || "",
      time: new Date().toISOString(),
      people_affected: stats.affected || 0,
      disaster: "Various",
      location: location,
    }));

    return events.map((event: any) => {
      const coordinates = extractCoordinates(event.location);
      const peopleAffected = event.people_affected || 0;
      const severity = estimateSeverity(peopleAffected);
      const magnitude = calculateMagnitude(peopleAffected);

      return {
        ...event,
        people_supported: event.people_supported || 0,
        coordinates,
        type: mapDisasterTypeToCode(event.disaster),
        severity,
        magnitude,
        description: `${event.disaster} affecting ${peopleAffected.toLocaleString()} people`,
        affectedArea: estimateAffectedArea(peopleAffected),
      };
    });
  } catch (error) {
    console.error("Error fetching disaster events:", error);
    return [];
  }
}

export async function fetchDisasterStats(): Promise<DisasterStats | null> {
  try {
    const [peopleResponse, fundingResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/people/stats`, { 
        headers: { "accept": "application/json" },
        next: { revalidate: CACHE_TTL },
      }),
      fetch(`${API_BASE_URL}/funding/stats`, { 
        headers: { "accept": "application/json" },
        next: { revalidate: CACHE_TTL },
      }),
    ]);

    if (!peopleResponse.ok || !fundingResponse.ok) {
      throw new Error("Failed to fetch stats");
    }

    const peopleData = await peopleResponse.json();
    const fundingData = await fundingResponse.json();

    const locations: Record<string, any> = {};
    let totalAffected = 0;
    let totalFunding = 0;

    if (peopleData.by_location) {
      Object.entries(peopleData.by_location).forEach(([location, stats]: [string, any]) => {
        locations[location] = {
          affected: stats.affected || 0,
          casualties: stats.casualties || 0,
          injured: stats.injured || 0,
          displaced: stats.displaced || 0,
        };
        totalAffected += stats.affected || 0;
      });
    }

    if (fundingData.by_location) {
      Object.entries(fundingData.by_location).forEach(([location, stats]: [string, any]) => {
        if (locations[location]) {
          locations[location].fundingRequested = stats.requested || 0;
          locations[location].fundingReceived = stats.received || 0;
        }
        totalFunding += stats.received || 0;
      });
    }

    return {
      total_affected: peopleData.total_affected || totalAffected,
      total_funding: fundingData.total_received || totalFunding,
      locations,
      disaster_types: {},
      sources: peopleData.source_urls_processed?.reduce((acc: Record<string, number>, url: string) => {
        const domain = new URL(url).hostname;
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {}),
      last_updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching disaster stats:", error);
    return null;
  }
}

// Utility functions remain unchanged
export function prepareBarChartData(stats: DisasterStats): ChartDataItem[] {
  if (!stats?.locations) return [];

  return Object.entries(stats.locations).map(([location, data]: [string, any]) => ({
    name: location,
    funding: data.fundingRequested || 0,
    fundingReceived: data.fundingReceived || 0,
    people: data.affected || 0,
    peopleReached: data.displaced || 0,
    orgs: 0,
    orgsSupported: 0,
  }));
}

export function prepareChartData(stats: DisasterStats): ChartDataItem[] {
  if (!stats?.locations) return [];

  return Object.entries(stats.locations).map(([location, data]: [string, any]) => ({
    name: location,
    fundingReceived: data.fundingReceived || 0,
    peopleReached: data.displaced || 0,
    orgsSupported: 0,
  }));
}

export function prepareLineChartData(stats: DisasterStats): ChartDataItem[] {
  if (!stats?.locations) return [];

  return Object.entries(stats.locations).map(([location, data]: [string, any]) => ({
    name: location,
    funding: data.fundingReceived || 0,
  }));
}

export function calculateTotalPeopleAffected(stats: DisasterStats): number {
  return stats?.total_affected || 0;
}

export function calculateTotalPeopleSupported(stats: DisasterStats): number {
  return Object.values(stats?.locations || {}).reduce((sum, loc: any) => sum + (loc.displaced || 0), 0);
}

export function calculateTotalOrganizations(stats: DisasterStats): number {
  return 0;
}

function extractCoordinates(location: string): { lat: number; lng: number } {
  return {
    lat: Math.random() * 140 - 70,
    lng: Math.random() * 340 - 170,
  };
}

function mapDisasterTypeToCode(disasterType: string): string {
  const type = disasterType?.toLowerCase() || "";
  if (type.includes("earthquake")) return "EQ";
  if (type.includes("flood")) return "FL";
  if (type.includes("drought")) return "DR";
  if (type.includes("fire")) return "WF";
  if (type.includes("cyclone") || type.includes("hurricane")) return "TC";
  return "TE";
}

function estimateSeverity(peopleAffected: number): string {
  if (peopleAffected >= 1000000) return "Extreme";
  if (peopleAffected >= 100000) return "Severe";
  if (peopleAffected >= 10000) return "Moderate";
  return "Minor";
}

function calculateMagnitude(peopleAffected: number): number {
  return Math.min(100, Math.max(20, Math.log10(peopleAffected + 1) * 15));
}

function estimateAffectedArea(peopleAffected: number): string {
  const area = Math.round(peopleAffected / 100);
  return `${area.toLocaleString()} sq km`;
}

export interface ChartDataItem {
  name: string;
  funding?: number;
  fundingReceived?: number;
  people?: number;
  peopleReached?: number;
  orgs?: number;
  orgsSupported?: number;
  [key: string]: any;
}