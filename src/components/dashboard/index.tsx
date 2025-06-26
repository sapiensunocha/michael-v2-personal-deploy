"use client";

import { useEffect, useState } from "react";
import WorldMap from "@/components/ui/dashboard/dashboardMap";
import { Chart } from "@/components/ui/dashboard/chart";
import Link from "next/link";
import { CiHome } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartComponent } from "@/components/ui/dashboard/barChart";
import PieChartComponent from "@/components/ui/dashboard/pieChart";
import {
  fetchDisasterStats,
  fetchDisasterEvents,
  prepareChartData,
  prepareBarChartData,
  prepareLineChartData,
  calculateTotalPeopleAffected,
  calculateTotalPeopleSupported,
  DisasterStats,
  DisasterEvent,
  ChartDataItem,
} from "@/app/api/disaster-service";

function DateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () =>
    dateTime.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg py-2 px-4 shadow-md">
      <FaClock className="text-yellow-500" />
      <div className="flex flex-col">
        <span className="text-sm text-white">{formatDateTime()}</span>
        <span className="text-xs text-gray-400">Powered by World Disaster Center</span>
      </div>
    </div>
  );
}

export default function DisasterDashboard() {
  const [chartData, setChartData] = useState<{ name: string; funding: number }[]>([]);
  const [sidebarChartData, setSidebarChartData] = useState<ChartDataItem[]>([]);
  const [pieChartData, setPieChartData] = useState<ChartDataItem[]>([]);
  const [disasterEvents, setDisasterEvents] = useState<DisasterEvent[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("funding");
  const [rightActiveTab, setRightActiveTab] = useState("funding");
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DisasterStats | null>(null);
  const [searchCountry, setSearchCountry] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const statsData = await fetchDisasterStats();
        setStats(statsData);

        // Fetch initial disaster events (no country filter)
        const initialEvents = await fetchDisasterEvents();
        setDisasterEvents(initialEvents);

        if (statsData) {
          const barData = prepareBarChartData(statsData);
          setSidebarChartData(barData);

          const pieData = prepareChartData(statsData);
          setPieChartData(pieData);

          const lineData = prepareLineChartData(statsData).map(item => ({
            name: item.name,
            funding: item.funding || 0,
          }));
          setChartData(lineData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load disaster data:", error);
        setIsLoading(false);
      }
    };

    loadData();

    const checkMobileView = () => setIsMobile(window.innerWidth <= 768);
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  // Fetch disaster events when searchCountry changes
  useEffect(() => {
    const fetchCountryEvents = async () => {
      if (searchCountry) {
        setIsLoading(true);
        try {
          const events = await fetchDisasterEvents(searchCountry);
          setDisasterEvents(events);
        } catch (error) {
          console.error("Failed to fetch country-specific events:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCountryEvents();
  }, [searchCountry]);

  const totalFundingNeeded = sidebarChartData.reduce((total, item) => total + (item.funding || 0), 0);
  const totalFundingReceived = pieChartData.reduce((total, item) => total + (item.fundingReceived || 0), 0);
  const totalPeopleAffected = stats ? calculateTotalPeopleAffected(stats) : 0;
  const totalPeopleReached = pieChartData.reduce((total, item) => total + (item.peopleReached || 0), 0);
  const totalEvents = stats?.locations ? Object.keys(stats.locations).length : 0;

  const MobileDashboardHeader = () => (
    <header className="md:hidden bg-[#1e1e1e] p-4 flex flex-col space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <Link href="/" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
          <CiHome className="text-white text-xl" />
        </Link>
        <div className="relative flex-grow mx-4">
          <input
            type="text"
            placeholder="Search country"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && setSearchCountry(e.currentTarget.value.trim())}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
          <FaLocationDot className="text-white text-xl" />
        </button>
      </div>
      <DateTime />
    </header>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1a1a1a] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mr-4"></div>
        <div className="text-lg">Loading disaster data...</div>
      </div>
    );
  }

  const renderLeftSidebarContent = () => (
    <aside className="w-full md:w-96 bg-[#252525] border-r-4 border-white flex flex-col h-full">
      <div className="p-6 bg-[#1e1e1e] shadow-lg">
        <DateTime />
      </div>
      <div className="p-6 bg-[#1e1e1e] grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-400">Funding Requested</h2>
          <p className="text-2xl font-bold text-yellow-500">
            ${totalFundingNeeded > 0 ? (totalFundingNeeded / 1000000000).toFixed(2) + "B" : "0"}
          </p>
          <p className="text-xs text-gray-500">Worldwide</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-400">Events</h2>
          <p className="text-2xl font-bold text-green-500">{totalEvents.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Active disasters</p>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-800 rounded-lg mb-4 shadow-md">
            <TabsTrigger value="funding" className="text-sm py-2">Funding</TabsTrigger>
            <TabsTrigger value="people" className="text-sm py-2">People</TabsTrigger>
            <TabsTrigger value="orgs" className="text-sm py-2">Orgs</TabsTrigger>
          </TabsList>
          {["funding", "people", "orgs"].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0">
              <div className="text-sm text-gray-400 mb-4">
                {tab === "funding" ? "Funding Requested" : tab === "people" ? "People Affected" : "Organizations"} by Location
              </div>
              <ul className="text-sm space-y-3">
                {sidebarChartData.map((item, index) => (
                  <li key={index} className="flex justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition shadow-sm">
                    <span>{item.name}</span>
                    <span className={tab === "funding" ? "text-yellow-500" : tab === "people" ? "text-red-500" : "text-blue-400"}>
                      {tab === "funding" ? `$${(item.funding || 0).toLocaleString()}` : 
                       tab === "people" ? `${(item.people || 0).toLocaleString()}` : 
                       `${(item.orgs || 0).toLocaleString()} orgs`}
                    </span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="bg-[#1e1e1e] p-6 border-t border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-400">
            {activeTab === "funding" ? "Funding Comparison" : activeTab === "people" ? "People Comparison" : "Orgs Comparison"}
          </p>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`text-sm px-4 py-2 rounded-lg ${showComparison ? "bg-blue-600" : "bg-gray-700"} hover:bg-blue-500 transition shadow-md`}
          >
            {showComparison ? "Hide" : "Compare"}
          </button>
        </div>
        <BarChartComponent data={sidebarChartData} activeTab={activeTab} showComparison={showComparison} />
      </div>
    </aside>
  );

  const renderRightSidebarContent = () => (
    <aside className="w-full md:w-96 bg-[#252525] border-l-4 border-white flex flex-col h-full">
      <div className="p-6 bg-[#1e1e1e] flex justify-end shadow-lg">
        <Button asChild variant="outline" size="sm" className="text-white rounded-lg border border-white hover:bg-gray-700 transition shadow-md">
          <Link href="/view-all-disasters">View All Disasters</Link>
        </Button>
      </div>
      <div className="p-6 bg-[#1e1e1e] grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-400">Funding Received</h2>
          <p className="text-2xl font-bold text-green-500">
            ${totalFundingReceived > 0 ? (totalFundingReceived / 1000000000).toFixed(2) + "B" : "0"}
          </p>
          <p className="text-xs text-gray-500">Worldwide</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-sm text-gray-400">People Reached</h2>
          <p className="text-2xl font-bold text-blue-500">
            {totalPeopleReached > 0 ? (totalPeopleReached / 1000000).toFixed(1) + "M" : "0"}
          </p>
          <p className="text-xs text-gray-500">Assisted</p>
        </div>
      </div>
      <div className="p-6 flex-1">
        <Tabs value={rightActiveTab} onValueChange={setRightActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-800 rounded-lg mb-4 shadow-md">
            <TabsTrigger value="funding" className="text-sm py-2">Funding</TabsTrigger>
            <TabsTrigger value="people" className="text-sm py-2">People</TabsTrigger>
            <TabsTrigger value="orgs" className="text-sm py-2">Orgs</TabsTrigger>
          </TabsList>
          {["funding", "people", "orgs"].map((tab) => (
            <TabsContent key={tab} value={tab} className="m-0">
              <div className="text-sm text-gray-400 mb-4">
                {tab === "funding" ? "Funding Received" : tab === "people" ? "People Reached" : "Organizations Supported"} Distribution
              </div>
              <div className="flex justify-center">
                <PieChartComponent data={pieChartData} activeTab={tab} />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div className="bg-[#1e1e1e] p-6 border-t border-gray-700 shadow-lg">
        <p className="text-sm text-gray-400 mb-4">Funding by Location</p>
        <Chart data={chartData} />
      </div>
    </aside>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      {isMobile && <MobileDashboardHeader />}
      <div className="flex flex-1 overflow-hidden">
        <div className={`${isMobile ? "hidden" : "block"} md:w-96 flex-shrink-0`}>
          {renderLeftSidebarContent()}
        </div>
        <main className="flex-1 relative overflow-hidden bg-gray-100">
          <WorldMap /> {/* Pass disaster events to WorldMap */}
        </main>
        <div className={`${isMobile ? "hidden" : "block"} md:w-96 flex-shrink-0`}>
          {renderRightSidebarContent()}
        </div>
      </div>
    </div>
  );
}