
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DisasterReport, GroupedReports } from "@/types";
import { groupReportsByLocation } from "@/utils/groupReports";

interface ReportState {
  reports: DisasterReport[];
  financialEstimations: { idReport: string; amount: number; aiDescription: string }[];
  support: { idReport: string; amount: number; location: { lat: number; lng: number } }[];
  groupedReports: GroupedReports[];
  addReport: (report: DisasterReport) => void;
  addFinancialEstimation: (estimation: { idReport: string; amount: number; aiDescription: string }) => void;
  addSupport: (idReport: string, amount: number, location: { lat: number; lng: number }) => void;
  getFilteredReports: (severity?: string) => DisasterReport[];
  updateGroupedReports: () => void;
  getTotalSupportForReport: (idReport: string) => number; // Helper function
  getTotalSupportForGroup: (group: GroupedReports) => number; // Helper function
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [
        {
          id: "1",
          userId: "user_1",
          name: "John Doe",
          email: "john.doe@example.com",
          disasterType: "Earthquake",
          severity: "High",
          helpNeeded: ["Medical Aid", "Food", "Shelter"],
          description: "A strong earthquake hit the region, causing severe damage.",
          location: { lat: 37.7749, lng: -122.4194 }, // San Francisco, USA
          immediateNeeds: "Medical assistance, food, and temporary shelter",
        },
        {
          id: "2",
          userId: "user_2",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          disasterType: "Flood",
          severity: "Medium",
          helpNeeded: ["Rescue Teams", "Drinking Water"],
          description: "Heavy rainfall has caused flooding in the city center.",
          location: { lat: 51.5074, lng: -0.1278 }, // London, UK
          immediateNeeds: "Evacuation support, clean drinking water",
        },
        {
          id: "3",
          userId: "user_3",
          name: "Ali Khan",
          email: "ali.khan@example.com",
          disasterType: "Tornado",
          severity: "High",
          helpNeeded: ["Rebuilding Materials", "Emergency Shelters"],
          description: "A massive tornado destroyed many homes.",
          location: { lat: 29.7604, lng: -95.3698 }, // Houston, USA
          immediateNeeds: "Emergency housing and rebuilding materials",
        },
        {
          id: "4",
          userId: "user_4",
          name: "Carlos Mendez",
          email: "carlos.mendez@example.com",
          disasterType: "Hurricane",
          severity: "High",
          helpNeeded: ["Medical Teams", "Food"],
          description: "A hurricane hit the coastal area causing widespread destruction.",
          location: { lat: 19.4326, lng: -99.1332 }, // Mexico City, Mexico
          immediateNeeds: "Medical teams and emergency food supplies",
        },
        {
          id: "5",
          userId: "user_5",
          name: "Emily Johnson",
          email: "emily.johnson@example.com",
          disasterType: "Wildfire",
          severity: "Medium",
          helpNeeded: ["Firefighters", "Evacuation"],
          description: "A wildfire is spreading rapidly due to strong winds.",
          location: { lat: -33.8688, lng: 151.2093 }, // Sydney, Australia
          immediateNeeds: "Firefighting support and evacuation plans",
        },
        {
          id: "6",
          userId: "user_6",
          name: "Wang Wei",
          email: "wang.wei@example.com",
          disasterType: "Landslide",
          severity: "Low",
          helpNeeded: ["Clearing Teams", "Temporary Housing"],
          description: "Heavy rains triggered landslides in the mountain region.",
          location: { lat: 39.9042, lng: 116.4074 }, // Beijing, China
          immediateNeeds: "Temporary housing and road clearing teams",
        },
        {
          id: "7",
          userId: "user_7",
          name: "Fatima Yusuf",
          email: "fatima.yusuf@example.com",
          disasterType: "Drought",
          severity: "Medium",
          helpNeeded: ["Water Supply", "Irrigation Support"],
          description: "A prolonged drought is affecting agricultural production.",
          location: { lat: -1.2921, lng: 36.8219 }, // Nairobi, Kenya
          immediateNeeds: "Water supply and irrigation equipment",
        },
        {
          id: "8",
          userId: "user_8",
          name: "Victor Petrov",
          email: "victor.petrov@example.com",
          disasterType: "Cold Wave",
          severity: "Low",
          helpNeeded: ["Winter Clothing", "Heating"],
          description: "Extreme cold temperatures are making life difficult for residents.",
          location: { lat: 55.7558, lng: 37.6173 }, // Moscow, Russia
          immediateNeeds: "Winter clothing and heating support",
        },
        {
          id: "9",
          userId: "user_9",
          name: "Ahmed Ibrahim",
          email: "ahmed.ibrahim@example.com",
          disasterType: "Sandstorm",
          severity: "Low",
          helpNeeded: ["Air Filters", "Medical Support"],
          description: "A severe sandstorm is reducing visibility and causing health issues.",
          location: { lat: 30.0444, lng: 31.2357 }, // Cairo, Egypt
          immediateNeeds: "Medical masks and air purification systems",
        },
        {
          id: "10",
          userId: "user_10",
          name: "Yuki Tanaka",
          email: "yuki.tanaka@example.com",
          disasterType: "Tsunami",
          severity: "High",
          helpNeeded: ["Rescue Teams", "Medical Aid"],
          description: "A tsunami has hit the coastal areas, causing severe damage.",
          location: { lat: 35.6895, lng: 139.6917 }, // Tokyo, Japan
          immediateNeeds: "Rescue operations and medical aid",
        },
      ],
      financialEstimations: [
        { idReport: "1", amount: 500000, aiDescription: "Estimated cost for medical aid and reconstruction" },
        { idReport: "2", amount: 300000, aiDescription: "Water supply and rescue operations" },
        { idReport: "3", amount: 700000, aiDescription: "Emergency shelters and rebuilding costs" },
        { idReport: "4", amount: 450000, aiDescription: "Medical and food relief efforts" },
        { idReport: "5", amount: 200000, aiDescription: "Firefighting and evacuation assistance" },
        { idReport: "6", amount: 150000, aiDescription: "Landslide clearing and temporary housing" },
        { idReport: "7", amount: 350000, aiDescription: "Water supply and drought relief" },
        { idReport: "8", amount: 180000, aiDescription: "Winter aid and heating assistance" },
        { idReport: "9", amount: 120000, aiDescription: "Medical support and air purification" },
        { idReport: "10", amount: 800000, aiDescription: "Rescue operations and disaster recovery" },
      ],
      support: [],
      groupedReports: [],
      addReport: (report) => {
        const updatedReports = [...get().reports, report];
        set({ reports: updatedReports });
        get().updateGroupedReports(); // Update grouped reports after adding a new report
      },
      addFinancialEstimation: (estimation) =>
        set((state) => ({ financialEstimations: [...state.financialEstimations, estimation] })),
      addSupport: (idReport, amount, location) => {
        if (amount <= 0) {
          console.error("Amount must be greater than 0.");
          return;
        }
        const reportExists = get().reports.some((report) => report.id === idReport);
        if (!reportExists) {
          console.error(`Report with ID ${idReport} does not exist.`);
          return;
        }
        set((state) => ({ support: [...state.support, { idReport, amount, location }] }));
      },
      getFilteredReports: (severity) => {
        const reports = get().reports;
        return reports.filter((report) => !severity || report.severity === severity);
      },
      updateGroupedReports: () => {
        const reports = get().reports;
        const groupedReports = groupReportsByLocation(reports);
        set({ groupedReports });
      },
      getTotalSupportForReport: (idReport) => {
        const support = get().support;
        return support.filter((s) => s.idReport === idReport).reduce((sum, s) => sum + s.amount, 0);
      },
      getTotalSupportForGroup: (group) => {
        const support = get().support;
        return group.reports.reduce((sum, report) => {
          return sum + support.filter((s) => s.idReport === report.id).reduce((total, s) => total + s.amount, 0);
        }, 0);
      },
    }),
    { name: "report-storage" },
  ),
);
