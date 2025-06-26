"use client";

import { useState, useEffect, useRef } from "react";
// Removed incorrect import statement for google maps types
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { IoSearch } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";

// Import disaster icons
import All from "../../../../assets/icons/all.png";
import tropicalCyclone from "../../../../assets/icons/cyclone1.png";
import droughtIcon from "../../../../assets/icons/drought1.png";
import earthquakeIcon from "../../../../assets/icons/earthquake1.png";
import floodIcon from "../../../../assets/icons/flood1.png";
import politicalIcon from "../../../../assets/icons/politic1.png";
import wildFire from "../../../../assets/icons/wildfire.png";

const containerStyle = {
  width: "100%",
  height: "calc(100% - 100px)", // Reduced height to make room for summary box
};

const center = {
  lat: -1.683,
  lng: 29.217,
};

// Dark theme map styles with white text
const mapStyles = [
  {
    elementType: "geometry",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }, { visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

// Sample disaster data with magnitude property
const sampleDisasters = [
  {
    id: "eq1",
    title: "Major Earthquake",
    location: { lat: -1.2, lng: 29.5 },
    severity: "Severe",
    type: "EQ",
    affectedArea: "5,000 sq km",
    date: "2025-02-15",
    description: "A 7.2 magnitude earthquake affecting several communities.",
    magnitude: 85, // Higher number = bigger circle
  },
  {
    id: "fl1",
    title: "Flash Floods",
    location: { lat: -2.1, lng: 28.9 },
    severity: "Moderate",
    type: "FL",
    affectedArea: "2,300 sq km",
    date: "2025-02-20",
    description: "Heavy rainfall leading to flash floods in low-lying areas.",
    magnitude: 45,
  },
  {
    id: "dr1",
    title: "Prolonged Drought",
    location: { lat: -1.8, lng: 30.1 },
    severity: "Extreme",
    type: "DR",
    affectedArea: "12,000 sq km",
    date: "2025-01-10",
    description: "Severe drought conditions affecting crops and water supply.",
    magnitude: 95,
  },
  {
    id: "wf1",
    title: "Forest Wildfire",
    location: { lat: -0.9, lng: 29.3 },
    severity: "Severe",
    type: "WF",
    affectedArea: "800 sq km",
    date: "2025-02-28",
    description: "Uncontrolled wildfire spreading through forested regions.",
    magnitude: 70,
  },
  {
    id: "tc1",
    title: "Tropical Cyclone",
    location: { lat: -2.5, lng: 30.5 },
    severity: "Extreme",
    type: "TC",
    affectedArea: "8,500 sq km",
    date: "2025-03-01",
    description: "Category 4 cyclone with sustained winds of 130 mph.",
    magnitude: 90,
  },
  {
    id: "cf1",
    title: "Armed Conflict",
    location: { lat: -1.1, lng: 28.6 },
    severity: "Severe",
    type: "conflicts",
    affectedArea: "3,200 sq km",
    date: "2025-02-10",
    description: "Ongoing armed conflict leading to mass displacement.",
    magnitude: 75,
  },
  {
    id: "te1",
    title: "Industrial Accident",
    location: { lat: -0.7, lng: 29.8 },
    severity: "Moderate",
    type: "TE",
    affectedArea: "50 sq km",
    date: "2025-03-02",
    description: "Chemical spill affecting local water supplies.",
    magnitude: 35,
  },
  {
    id: "vo1",
    title: "Volcanic Activity",
    location: { lat: -1.5, lng: 29.0 },
    severity: "Severe",
    type: "VO",
    affectedArea: "1,200 sq km",
    date: "2025-02-25",
    description: "Increased volcanic activity with ash emissions and lava flows.",
    magnitude: 65,
  },
  {
    id: "eq2",
    title: "Coastal Earthquake",
    location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    severity: "Moderate",
    type: "EQ",
    affectedArea: "1,200 sq km",
    date: "2025-02-18",
    description: "A 5.8 magnitude earthquake affecting coastal regions.",
    magnitude: 58,
  },
  {
    id: "fl2",
    title: "Monsoon Flooding",
    location: { lat: 23.8103, lng: 90.4125 }, // Bangladesh
    severity: "Severe",
    type: "FL",
    affectedArea: "15,000 sq km",
    date: "2025-01-25",
    description: "Severe monsoon flooding affecting multiple districts.",
    magnitude: 82,
  },
  {
    id: "dr2",
    title: "Agricultural Drought",
    location: { lat: -33.8688, lng: 151.2093 }, // Sydney
    severity: "Moderate",
    type: "DR",
    affectedArea: "8,000 sq km",
    date: "2025-02-05",
    description: "Prolonged dry conditions affecting agricultural production.",
    magnitude: 55,
  },
  {
    id: "wf2",
    title: "Mediterranean Wildfire",
    location: { lat: 37.9838, lng: 23.7275 }, // Athens
    severity: "Extreme",
    type: "WF",
    affectedArea: "1,500 sq km",
    date: "2025-03-05",
    description: "Uncontrolled wildfire spreading through Mediterranean forests.",
    magnitude: 88,
  },
  {
    id: "tc2",
    title: "Pacific Typhoon",
    location: { lat: 14.5995, lng: 120.9842 }, // Manila
    severity: "Extreme",
    type: "TC",
    affectedArea: "12,000 sq km",
    date: "2025-02-22",
    description: "Category 5 typhoon with sustained winds of 160 mph.",
    magnitude: 95,
  },
  {
    id: "cf2",
    title: "Regional Conflict",
    location: { lat: 33.8869, lng: 35.5131 }, // Beirut
    severity: "Severe",
    type: "conflicts",
    affectedArea: "2,800 sq km",
    date: "2025-01-30",
    description: "Escalating regional conflict causing civilian displacement.",
    magnitude: 78,
  },
  {
    id: "te2",
    title: "Nuclear Plant Incident",
    location: { lat: 51.389, lng: 30.0997 }, // Chernobyl
    severity: "Moderate",
    type: "TE",
    affectedArea: "300 sq km",
    date: "2025-02-12",
    description: "Technical incident at nuclear power facility.",
    magnitude: 62,
  },
  {
    id: "vo2",
    title: "Major Volcanic Eruption",
    location: { lat: -8.4095, lng: 115.1889 }, // Bali
    severity: "Extreme",
    type: "VO",
    affectedArea: "3,500 sq km",
    date: "2025-03-08",
    description: "Major volcanic eruption with ash cloud affecting air travel.",
    magnitude: 92,
  },
  {
    id: "eq3",
    title: "Alpine Earthquake",
    location: { lat: 46.2044, lng: 6.1432 }, // Geneva
    severity: "Moderate",
    type: "EQ",
    affectedArea: "800 sq km",
    date: "2025-02-10",
    description: "A 5.2 magnitude earthquake in the Alpine region.",
    magnitude: 52,
  },
  {
    id: "fl3",
    title: "Amazon Basin Flooding",
    location: { lat: -3.119, lng: -60.0217 }, // Manaus
    severity: "Severe",
    type: "FL",
    affectedArea: "25,000 sq km",
    date: "2025-01-15",
    description: "Extensive flooding throughout the Amazon basin.",
    magnitude: 85,
  },
  {
    id: "dr3",
    title: "Sahel Drought Crisis",
    location: { lat: 14.7167, lng: -17.4677 }, // Dakar
    severity: "Extreme",
    type: "DR",
    affectedArea: "120,000 sq km",
    date: "2025-01-05",
    description: "Catastrophic drought affecting multiple countries in the Sahel region.",
    magnitude: 98,
  },
  {
    id: "wf3",
    title: "Australian Bushfire",
    location: { lat: -37.8136, lng: 144.9631 }, // Melbourne
    severity: "Severe",
    type: "WF",
    affectedArea: "5,000 sq km",
    date: "2025-02-15",
    description: "Extensive bushfires threatening suburban communities.",
    magnitude: 75,
  },
  {
    id: "tc3",
    title: "Caribbean Hurricane",
    location: { lat: 18.1096, lng: -77.2975 }, // Jamaica
    severity: "Severe",
    type: "TC",
    affectedArea: "6,000 sq km",
    date: "2025-03-10",
    description: "Category 3 hurricane affecting multiple Caribbean islands.",
    magnitude: 80,
  },
  {
    id: "cf3",
    title: "Civil Unrest",
    location: { lat: 6.5244, lng: 3.3792 }, // Lagos
    severity: "Moderate",
    type: "conflicts",
    affectedArea: "500 sq km",
    date: "2025-02-28",
    description: "Civil unrest leading to humanitarian concerns in urban areas.",
    magnitude: 60,
  },
  {
    id: "te3",
    title: "Oil Spill",
    location: { lat: 29.7604, lng: -95.3698 }, // Houston
    severity: "Severe",
    type: "TE",
    affectedArea: "1,200 sq km",
    date: "2025-02-20",
    description: "Major offshore oil spill affecting coastal ecosystems.",
    magnitude: 78,
  },
  {
    id: "vo3",
    title: "Andean Volcanic Activity",
    location: { lat: -33.4489, lng: -70.6693 }, // Santiago
    severity: "Moderate",
    type: "VO",
    affectedArea: "1,800 sq km",
    date: "2025-01-20",
    description: "Increased volcanic activity in the Andean mountain range.",
    magnitude: 65,
  },
];

const Map = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSummary, setActiveSummary] = useState<string>(
    "Click on a location to view disaster information or use the search box to find specific locations.",
  );
  const [showGlobalSummary, setShowGlobalSummary] = useState<boolean>(true);
  const [, setSelectedMarker] = useState<any>(null);
  const [activeDisasters, setActiveDisasters] = useState(sampleDisasters);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  // eslint-disable-next-line no-undef
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
    libraries: ["places"],
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    const cachedLocation = localStorage.getItem("userLocation");

    if (cachedLocation) {
      const coords = JSON.parse(cachedLocation);
      setUserLocation({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newLocation);
        localStorage.setItem(
          "userLocation",
          JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        );
        setGeoError(null);
      },
      (error: any) => {
        if (!cachedLocation) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setGeoError("Location access denied.");
              break;
            case error.POSITION_UNAVAILABLE:
              setGeoError("Location information unavailable.");
              break;
            case error.TIMEOUT:
              setGeoError("Location request timed out.");
              break;
            default:
              setGeoError(`Error getting location: ${error.message}`);
          }
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  // Filter disasters by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setActiveDisasters(sampleDisasters);
    } else {
      setActiveDisasters(sampleDisasters.filter((disaster) => disaster.type === selectedCategory));
    }
    // Close tooltip when changing categories
    setShowTooltip(false);
  }, [selectedCategory]);

  // Get color based on disaster type
  const getDisasterColor = (type: string) => {
    switch (type) {
      case "EQ":
        return "#FF5733"; // Orange-red for earthquakes
      case "FL":
        return "#33A1FF"; // Blue for floods
      case "DR":
        return "#FFD700"; // Gold for drought
      case "WF":
        return "#FF3333"; // Red for wildfires
      case "TC":
        return "#8A2BE2"; // Purple for cyclones
      case "conflicts":
        return "#FF33A1"; // Pink for conflicts
      case "TE":
        return "#33FF57"; // Green for technological
      case "VO":
        return "#A52A2A"; // Brown for volcanic
      default:
        return "#FFFFFF"; // White for unknown
    }
  };

  // Calculate circle size based on magnitude (min 20px, max 60px)
  const getCircleSize = (magnitude: number) => {
    return Math.max(20, Math.min(60, magnitude * 0.6));
  };

  // Function to handle marker click
  const handleMarkerClick = (disaster: any) => {
    setSelectedMarker(disaster);
    setShowGlobalSummary(false);
    setActiveSummary(
      `${disaster.severity} ${disaster.title} reported on ${new Date(disaster.date).toLocaleDateString()}. Affecting an area of approximately ${disaster.affectedArea}. ${disaster.description}`,
    );

    // Set tooltip content and position
    setTooltipContent(disaster);
    setTooltipPosition(disaster.location);
    setShowTooltip(true);
  };

  // Close tooltip when clicking on map
  const handleMapClick = () => {
    setShowTooltip(false);
  };

  // Map Header Component
  const MapHeader = () => (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-[#1e1e1e] flex items-center justify-between">
      <div className="flex items-center space-x-4 w-full">
        <button
          className="bg-white p-2 rounded-full"
          onClick={() => {
            setShowGlobalSummary(true);
            setActiveSummary(
              "Click on a location to view disaster information or use the search box to find specific locations.",
            );
            setSelectedMarker(null);
            setShowTooltip(false);
          }}
        >
          <CiHome className="text-black text-xl" />
        </button>
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        <button
          className="bg-white p-2 rounded-full"
          onClick={() => {
            if (userLocation) {
              setShowGlobalSummary(false);
              setActiveSummary(
                `Your location: ${userLocation.lat.toFixed(3)}, ${userLocation.lng.toFixed(3)}. Checking nearby disasters...`,
              );
              setShowTooltip(false);
              // Simulating data loading
              setTimeout(() => {
                setActiveSummary("No active disasters in your immediate vicinity. Zoom out to see regional events.");
              }, 1500);
            }
          }}
        >
          <FaLocationDot className="text-black text-xl" />
        </button>
      </div>
    </div>
  );

  // Categories filter component
  const CategoriesFilter = () => (
    <div className="absolute top-16 left-0 right-0 z-10 p-2 bg-[#1e1e1e] overflow-x-auto whitespace-nowrap">
      <div className="flex space-x-2 px-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "all" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={All || "/placeholder.svg"} alt="All" width={16} height={16} />
          </div>
          All
        </button>
        <button
          onClick={() => setSelectedCategory("EQ")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "EQ" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={earthquakeIcon || "/placeholder.svg"} alt="Earthquakes" width={16} height={16} />
          </div>
          Earthquakes
        </button>
        <button
          onClick={() => setSelectedCategory("FL")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "FL" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={floodIcon || "/placeholder.svg"} alt="Floods" width={16} height={16} />
          </div>
          Floods
        </button>
        <button
          onClick={() => setSelectedCategory("DR")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "DR" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={droughtIcon || "/placeholder.svg"} alt="Drought" width={16} height={16} />
          </div>
          Drought
        </button>
        <button
          onClick={() => setSelectedCategory("WF")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "WF" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={wildFire || "/placeholder.svg"} alt="Wildfires" width={16} height={16} />
          </div>
          Wildfires
        </button>
        <button
          onClick={() => setSelectedCategory("TC")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "TC" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={tropicalCyclone || "/placeholder.svg"} alt="Cyclones" width={16} height={16} />
          </div>
          Cyclones
        </button>
        <button
          onClick={() => setSelectedCategory("conflicts")}
          className={`px-3 py-1 rounded-full flex items-center text-xs ${selectedCategory === "conflicts" ? "bg-red-400 text-white" : "bg-white text-black"}`}
        >
          <div className="w-4 h-4 mr-1">
            <Image src={politicalIcon || "/placeholder.svg"} alt="Conflicts" width={16} height={16} />
          </div>
          Conflicts
        </button>
      </div>
    </div>
  );

  // Global Crisis Summary
  const globalCrisisSummary =
    "Conflicts, economic instability, and climate disasters are escalating humanitarian needs worldwide. Sudan's civil war has displaced millions, while severe hunger threatens countries like Haiti, South Sudan, and Mali. In the DRC, intensified conflict has led to mass displacements, worsening an already dire situation. The UN has launched a $47 billion appeal, but funding shortfalls hinder critical aid efforts. Attacks on aid workers are increasing, further restricting humanitarian access. Urgent global action is needed to prevent worsening crises and address growing vulnerabilities.";

  // Summary Box Component
  const SummaryBox = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-gray-700 p-4 z-10">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">
          {showGlobalSummary ? "Global Humanitarian Crisis Overview" : "Disaster Information Summary"}
        </h3>
        <p className="text-white text-sm">{showGlobalSummary ? globalCrisisSummary : activeSummary}</p>
      </div>
    </div>
  );

  // Custom Circle Marker Component
  const CircleMarker = ({ disaster }: { disaster: any }) => {
    const size = getCircleSize(disaster.magnitude);
    const color = getDisasterColor(disaster.type);

    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          opacity: 0.8,
          border: "2px solid white",
        }}
        onClick={() => handleMarkerClick(disaster)}
      >
        <span className="text-white text-xs font-bold">{disaster.magnitude}</span>
      </div>
    );
  };

  // Tooltip Component
  const Tooltip = ({ disaster }: { disaster: any }) => {
    if (!disaster) return null;

    return (
      <div className="absolute z-20 transform -translate-x-1/2 -translate-y-full mb-2 pointer-events-none">
        <div className="bg-gray-900 bg-opacity-90 text-white p-3 rounded-lg shadow-lg border border-gray-700 max-w-xs">
          <div className="font-bold text-sm mb-1">{disaster.title}</div>
          <div className="text-xs mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full mr-1"
              style={{ backgroundColor: getDisasterColor(disaster.type) }}
            >
              {disaster.severity}
            </span>
            <span className="text-gray-300">{new Date(disaster.date).toLocaleDateString()}</span>
          </div>
          <div className="text-xs text-gray-300">{disaster.description}</div>
          <div className="text-xs mt-1">Affected area: {disaster.affectedArea}</div>
          <div className="text-xs mt-1">Impact level: {disaster.magnitude}/100</div>
          <div className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  // Error handling for map loading
  if (loadError)
    return <div className="flex justify-center items-center h-full text-red-500 bg-black">Error loading maps</div>;

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-full bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );

  // Handle geolocation error
  if (geoError)
    return (
      <div className="h-full flex items-center justify-center bg-black text-white">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-4xl mb-4">📍</div>
          <div className="text-2xl font-bold text-white mb-2">Location Required</div>
          <div className="text-gray-300">{geoError}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="relative h-full w-full">
      <MapHeader />
      <CategoriesFilter />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={4}
        options={{
          mapTypeId: "roadmap",
          styles: mapStyles,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          controlSize: 24,
          restriction: {
            latLngBounds: {
              north: 85,
              south: -85,
              east: 179.99,
              west: -179.99,
            },
            strictBounds: true,
          },
          minZoom: 2,
          maxZoom: 5,
          zoomControlOptions: {
            position: 2, // TOP_LEFT
          },
          streetViewControlOptions: {
            position: 5, // LEFT_BOTTOM
          },
          fullscreenControlOptions: {
            position: 3, // RIGHT_TOP
          },
          mapTypeControlOptions: {
            style: 1, // HORIZONTAL_BAR
            position: 1, // TOP_RIGHT
          },
        }}
        onClick={handleMapClick}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {/* Render circle markers for all active disasters */}
        {activeDisasters.map((disaster) => (
          <OverlayView key={disaster.id} position={disaster.location} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <CircleMarker disaster={disaster} />
          </OverlayView>
        ))}

        {/* Render tooltip for selected marker */}
        {showTooltip && tooltipContent && tooltipPosition && (
          <OverlayView position={tooltipPosition} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <Tooltip disaster={tooltipContent} />
          </OverlayView>
        )}
      </GoogleMap>
      <SummaryBox />
    </div>
  );
};

export default Map;

