export interface DisasterReport {
  id: string,
  userId?: string,
  name?: string,
  email?: string,
  disasterType: string,
  severity: "Low" | "Medium" | "High",
  helpNeeded?: string[],
  description: string,
  location: { lat: number, lng: number },
  immediateNeeds: string,
  financialEstimation?: { amount: number, aiDescription: string },
}

export interface GroupedReports {
  center: { lat: number, lng: number },
  reports: DisasterReport[],
}

export interface DisasterEvent {
  id: string,
  longitude: number,
  latitude: number,
  place: string,
  url?: string,
  detailUrl?: string,
  disaster_type: string,
  tsunami?: number,
  depth: number | null,
  magnitude: number | null,
  status: string,
  time: number,
  summary: string,
  risk_level: "High" | "Moderate" | "Low",
}