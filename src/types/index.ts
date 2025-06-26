export interface DisasterReport {
    id: string;
    userId?: string;
    name?: string;
    email?: string;
    disasterType: string;
    severity: "Low" | "Medium" | "High";
    helpNeeded?: string[];
    description: string;
    location: { lat: number; lng: number };
    immediateNeeds: string;
    financialEstimation?: { amount: number; aiDescription: string };
  }
  
  export interface GroupedReports {
    center: { lat: number; lng: number };
    reports: DisasterReport[];
  }