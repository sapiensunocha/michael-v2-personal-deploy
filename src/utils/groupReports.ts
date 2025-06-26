import { DisasterReport, GroupedReports } from "@/types";

const RADIUS = 50000;

export const groupReportsByLocation = (reports: DisasterReport[]): GroupedReports[] => {
  const groupedReports: GroupedReports[] = [];

  reports.forEach((report) => {
    let addedToGroup = false;

    for (const group of groupedReports) {
      const distance = getDistance(group.center, report.location);
      if (distance <= RADIUS) {
        group.reports.push(report);
        addedToGroup = true;
        break;
      }
    }

    if (!addedToGroup) {
      groupedReports.push({
        center: report.location,
        reports: [report],
      });
    }
  });

  return groupedReports;
};

// Helper function to calculate distance between two coordinates
const getDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }) => {
  const R = 6371e3; // Earth radius in meters
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};