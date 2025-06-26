import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaSearch, FaFilter, FaChevronDown, FaBell, FaUser, FaEnvelope, FaEllipsisH } from "react-icons/fa";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setSelectedLocation } from "@/redux/slice/location";
import { unifiedDisasters, DisasterEvent } from "@/dataSources/unifiedDisasters";
import RightSidePanel from "../RightSidePanel";
import UserProfileContent from "../UserProfileContent";
import NotificationsPanel from "../NotificationsPanel";
import MessagesPanel from "../MessagesPanel";

const OCHA_COLORS = {
  blue: "#005A8A",
  lightBlue: "#00A5CF",
  orange: "#F28C38",
  red: "#D1342F",
  green: "#00994F",
  yellow: "#FFC107",
  gray: "#4A4A4A",
  lightGray: "#E0E0E0",
  white: "#FFFFFF",
};

const markerAnimationAndHoverCss = `
  @keyframes pulse-marker {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }

  .leaflet-marker-icon.active-disaster {
    animation: pulse-marker 1.5s infinite ease-in-out;
  }

  .custom-tooltip {
    background-color: rgba(255, 255, 255, 0.95);
    color: ${OCHA_COLORS.gray};
    border: 1px solid ${OCHA_COLORS.blue};
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    font-size: 0.9rem;
    line-height: 1.5;
    max-width: 220px;
    font-family: Arial, sans-serif;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .leaflet-tooltip-pane .custom-tooltip {
    opacity: 1;
    transform: translateY(0);
  }

  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: ${OCHA_COLORS.red};
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 0.7rem;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("marker-animation-style")) {
  const style = document.createElement("style");
  style.id = "marker-animation-style";
  style.innerHTML = markerAnimationAndHoverCss;
  document.head.appendChild(style);
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface DisasterIconConfig {
  [key: string]: { icon: string; color: string; size: number };
}

const disasterIconConfig: DisasterIconConfig = {
  earthquake: { icon: "/earthquake.png", color: OCHA_COLORS.red, size: 28 },
  "tropical cyclone": { icon: "/cyclone1.png", color: OCHA_COLORS.blue, size: 28 },
  wildfire: { icon: "/wildfire.png", color: OCHA_COLORS.orange, size: 28 },
  drought: { icon: "/drought.png", color: OCHA_COLORS.yellow, size: 28 },
  flood: { icon: "/flood.png", color: OCHA_COLORS.lightBlue, size: 28 },
  "explosions/remote violence": { icon: "/explosion.png", color: OCHA_COLORS.red, size: 28 },
  protests: { icon: "/protest.png", color: OCHA_COLORS.green, size: 28 },
  "strategic developments": { icon: "/strat1.png", color: OCHA_COLORS.blue, size: 28 },
  riots: { icon: "/riot.png", color: OCHA_COLORS.orange, size: 28 },
  "violence against civilians": { icon: "/violence.png", color: OCHA_COLORS.red, size: 28 },
  battles: { icon: "/battle.png", color: OCHA_COLORS.gray, size: 28 },
};

const createCustomIcon = (iconUrl: string, color: string, size: number, classNameSuffix: string) => {
  return L.divIcon({
    className: `custom-marker-icon-container ${classNameSuffix}`,
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: url('${iconUrl}') no-repeat center center;
        background-size: contain;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
      ">
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const getDisasterIcon = (disasterType: string, magnitude: number) => {
  const typeKey = disasterType.toLowerCase();
  const config = disasterIconConfig[typeKey] || disasterIconConfig.earthquake;
  let size = config.size;
  if (typeKey === "earthquake") {
    size = magnitude >= 6.0 ? 36 : magnitude >= 4.5 ? 32 : 28;
  } else if (typeKey === "tropical cyclone") {
    size = magnitude >= 7.0 ? 36 : magnitude >= 6.0 ? 32 : 28;
  }
  return createCustomIcon(config.icon, config.color, size, typeKey.replace(/[^a-z0-9]/g, "-"));
};

const SIDEBAR_WIDTH_OPEN = "400px";
const SIDEBAR_WIDTH_CLOSED = "0px";
const SIDEBAR_TRANSITION_DURATION = "0.3s";

type FilterType = "all" | "earthquake" | "tropical cyclone" | "wildfire" | "drought" | "flood" |
  "explosions/remote violence" | "protests" | "strategic developments" | "riots" |
  "violence against civilians" | "battles";

interface SelectedLocation {
  lat: number;
  lon: number;
  address: string;
}

const MapComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedLocation = useSelector((state: RootState) => state.location.selectedLocation) as SelectedLocation | null;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<"profile" | "notifications" | "messages" | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const [initialMapCenter, setInitialMapCenter] = useState<[number, number]>([31.5, 34.5]);
  const [userCurrentLocation, setUserCurrentLocation] = useState<L.LatLngExpression | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const [disasterData, setDisasterData] = useState<DisasterEvent[]>([]);

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialMapCenter([latitude, longitude]);
          setUserCurrentLocation([latitude, longitude]);
        },
        () => {
          alert("Could not retrieve your location. Defaulting to Middle East.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  }, []);

  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        const data = await unifiedDisasters();
        if (data.length < 20) {
          const mockData: DisasterEvent[] = [];
          const types = Object.keys(disasterIconConfig);
          for (let i = 0; i < 20; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            mockData.push({
              id: `mock-${i}`,
              longitude: 34.5 + (Math.random() - 0.5) * 5,
              latitude: 31.5 + (Math.random() - 0.5) * 5,
              place: `${type} Area ${i}`,
              depth: Math.random() * 50,
              magnitude: Math.random() * 8,
              time: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
              tsunami: 0,
              url: "#",
              detailUrl: "#",
              disaster_type: type,
            });
          }
          setDisasterData(mockData);
        } else {
          setDisasterData(data);
        }
      } catch (error) {
        console.error("Failed to fetch disaster data:", error);
      }
    };

    fetchDisasterData();
    const intervalId = setInterval(fetchDisasterData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const MapEventsHandler: React.FC = () => {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        // TODO: Implement reverse geocoding with Nominatim API
        const address = "Sample Address";
        dispatch(setSelectedLocation({ lat, lon: lng, address }));
      },
      moveend: () => setMapBounds(map.getBounds()),
      zoomend: () => setMapBounds(map.getBounds()),
      load: () => {
        setMapBounds(map.getBounds());
        setIsMapReady(true);
      },
    });

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    return null;
  };

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lon], 15);
    }
  }, [selectedLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // TODO: Implement forward geocoding with Nominatim API
    const results = [{ lat: 31.5, lon: 34.5, address: "Sample Location" }];
    if (results.length > 0) {
      const firstResult = results[0];
      dispatch(setSelectedLocation({
        lat: firstResult.lat,
        lon: firstResult.lon,
        address: firstResult.address,
      }));
      setSearchTerm("");
    } else {
      alert("No results found. Please try another query.");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNotificationsClick = useCallback(() => {
    setActivePanel("notifications");
    setUnreadNotificationsCount(0);
  }, []);

  const visibleDisasters = useMemo(() => {
    if (!mapBounds || !isMapReady || disasterData.length === 0) return [];
    return disasterData.filter(event =>
      typeof event.latitude === "number" && !isNaN(event.latitude) &&
      typeof event.longitude === "number" && !isNaN(event.longitude) &&
      typeof event.magnitude === "number" && !isNaN(event.magnitude) &&
      mapBounds.contains(L.latLng(event.latitude, event.longitude)) &&
      (activeFilter === "all" || event.disaster_type.toLowerCase() === activeFilter),
    );
  }, [disasterData, mapBounds, isMapReady, activeFilter]);

  const allActiveAlerts = useMemo(() => {
    const alerts: { id: string; type: string; title: string; time: number; link?: string; details: string }[] = [];
    disasterData.filter(event => event.time >= (Date.now() - 24 * 60 * 60 * 1000)).forEach(event => {
      const disasterType = event.disaster_type.toLowerCase();
      const specificDetails: { [key: string]: string } = {
        earthquake: `Depth: ${event.depth?.toFixed(1) ?? "N/A"} km | Epicenter: ${event.place}`,
        "tropical cyclone": `Wind Speed: Est. ${Math.round(event.magnitude * 10)} km/h`,
        wildfire: `Area Affected: Est. ${Math.round(event.magnitude * 100)} sq km`,
        drought: `Severity: Level ${Math.round(event.magnitude)}`,
        flood: `Water Level: Est. ${Math.round(event.magnitude * 2)} meters`,
        "explosions/remote violence": `Casualties: Unknown | Location: ${event.place}`,
        protests: `Participants: Est. ${Math.round(event.magnitude * 50)}`,
        "strategic developments": `Impact: Strategic | Time: ${new Date(event.time).toLocaleString()}`,
        riots: `Intensity: High | Location: ${event.place}`,
        "violence against civilians": `Casualties: Unknown | Time: ${new Date(event.time).toLocaleString()}`,
        battles: `Duration: Ongoing | Location: ${event.place}`,
      };
      alerts.push({
        id: event.id,
        type: disasterType.charAt(0).toUpperCase() + disasterType.slice(1),
        title: `${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} at ${event.place}`,
        time: event.time,
        link: event.url,
        details: specificDetails[disasterType] || `Magnitude: ${event.magnitude.toFixed(1)} | Location: ${event.place}`,
      });
    });
    return alerts.sort((a, b) => b.time - a.time);
  }, [disasterData]);

  const getSafetyAnalysis = (location: SelectedLocation | null) => {
    if (!location) return null;

    const nearbyDisasters = visibleDisasters.filter(event => {
      const eventLatLng = L.latLng(event.latitude, event.longitude);
      const selectedLatLng = L.latLng(location.lat, location.lon);
      return eventLatLng.distanceTo(selectedLatLng) < 200000;
    });

    let riskLevel = "Unknown";
    let advice = "No specific advice available.";
    let color = OCHA_COLORS.gray;

    if (nearbyDisasters.length === 0) {
      riskLevel = "Low Risk";
      advice = "No recent significant disaster activity detected nearby. Stay vigilant.";
      color = OCHA_COLORS.green;
    } else if (nearbyDisasters.length < 3) {
      riskLevel = "Moderate Risk";
      advice = `Recent activity detected (${nearbyDisasters.length} events). Monitor alerts and prepare an emergency kit.`;
      color = OCHA_COLORS.yellow;
    } else {
      riskLevel = "High Risk";
      advice = `Significant activity detected (${nearbyDisasters.length} events). Evacuate if ordered and follow local guidance.`;
      color = OCHA_COLORS.red;
    }

    return (
      <div style={{
        backgroundColor: "#F9F9F9",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop: "15px",
        borderLeft: `4px solid ${color}`,
        fontFamily: "Arial, sans-serif",
      }}>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: OCHA_COLORS.blue, fontWeight: 600 }}>Safety Analysis</h3>
        <p style={{ margin: "0", fontSize: "1rem", color, fontWeight: 500 }}>{riskLevel}</p>
        <p style={{ margin: "5px 0 0", fontSize: "0.85rem", color: OCHA_COLORS.gray, lineHeight: 1.5 }}>{advice}</p>
      </div>
    );
  };

  const getDisasterHoverContent = (event: DisasterEvent) => {
    const disasterType = event.disaster_type.toLowerCase();
    const specificDetails: { [key: string]: string } = {
      earthquake: `Depth: ${event.depth?.toFixed(1) ?? "N/A"} km | Epicenter: ${event.place}`,
      "tropical cyclone": `Wind Speed: Est. ${Math.round(event.magnitude * 10)} km/h`,
      wildfire: `Area Affected: Est. ${Math.round(event.magnitude * 100)} sq km`,
      drought: `Severity: Level ${Math.round(event.magnitude)}`,
      flood: `Water Level: Est. ${Math.round(event.magnitude * 2)} meters`,
      "explosions/remote violence": `Casualties: Unknown | Location: ${event.place}`,
      protests: `Participants: Est. ${Math.round(event.magnitude * 50)}`,
      "strategic developments": `Impact: Strategic | Time: ${new Date(event.time).toLocaleString()}`,
      riots: `Intensity: High | Location: ${event.place}`,
      "violence against civilians": `Casualties: Unknown | Time: ${new Date(event.time).toLocaleString()}`,
      battles: `Duration: Ongoing | Location: ${event.place}`,
    };
    return `
      <p><strong>${disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}</strong></p>
      <p>${specificDetails[disasterType] || `Magnitude: ${event.magnitude.toFixed(1)} | Location: ${event.place}`}</p>
      ${event.url ? `<a href="${event.url}" target="_blank" rel="noopener noreferrer">More Info</a>` : ""}
    `;
  };

  const renderRiskCircle = (lat: number, lon: number, radiusKm: number, color: string) => {
    if (typeof lat !== "number" || isNaN(lat) || typeof lon !== "number" || isNaN(lon)) return null;
    const radius = radiusKm <= 0 ? 10000 : radiusKm * 1000;
    return (
      <Circle
        center={[lat, lon]}
        radius={radius}
        pathOptions={{ color, fillColor: color, fillOpacity: 0.1, weight: 1 }}
      />
    );
  };

  const iconButtonStyle: React.CSSProperties = {
    padding: "10px",
    backgroundColor: OCHA_COLORS.white,
    color: OCHA_COLORS.blue,
    border: `1px solid ${OCHA_COLORS.lightGray}`,
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontSize: "0.75rem",
    fontWeight: 500,
    transition: "background-color 0.2s, box-shadow 0.2s",
    width: "70px",
    height: "60px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "1.4rem",
  };

  const appTextStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    color: OCHA_COLORS.gray,
    lineHeight: 1.5,
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden", ...appTextStyle }}>
      <Image
        src="/logo icon.png"
        alt="App Logo"
        width={48}
        height={48}
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          zIndex: 500,
          borderRadius: "6px",
          backgroundColor: OCHA_COLORS.white,
          padding: "4px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: isSidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
          backgroundColor: OCHA_COLORS.white,
          color: OCHA_COLORS.gray,
          zIndex: 1500,
          transition: `width ${SIDEBAR_TRANSITION_DURATION} ease-in-out`,
          overflowX: "hidden",
          padding: isSidebarOpen ? "20px" : "0",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          ...appTextStyle,
        }}
      >
        {isSidebarOpen && (
          <>
            <div style={{ display: "flex", gap: "10px", width: "100%", alignItems: "center" }}>
              <form onSubmit={handleSearch} style={{ display: "flex", flexGrow: 1, gap: "8px" }}>
                <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: OCHA_COLORS.lightBlue, fontSize: "1rem", pointerEvents: "none" }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search location..."
                  style={{
                    flexGrow: 1,
                    padding: "10px 10px 10px 35px",
                    borderRadius: "6px",
                    border: `1px solid ${OCHA_COLORS.lightGray}`,
                    backgroundColor: "#F9F9F9",
                    color: OCHA_COLORS.gray,
                    fontSize: "0.9rem",
                    outline: "none",
                    ...appTextStyle,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 15px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: OCHA_COLORS.blue,
                    color: OCHA_COLORS.white,
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    transition: "background-color 0.2s",
                    ...appTextStyle,
                  }}
                >
                  Search
                </button>
              </form>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${OCHA_COLORS.lightGray}`,
                    backgroundColor: OCHA_COLORS.white,
                    color: OCHA_COLORS.blue,
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    ...appTextStyle,
                  }}
                  title="Filter Map Data"
                >
                  <FaFilter /> Filter <FaChevronDown />
                </button>
                {showFilterDropdown && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    backgroundColor: OCHA_COLORS.white,
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    padding: "8px",
                    zIndex: 2000,
                    minWidth: "200px",
                  }}>
                    {Object.keys(disasterIconConfig).concat("all").map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setActiveFilter(filter as FilterType);
                          setShowFilterDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          backgroundColor: activeFilter === filter ? OCHA_COLORS.lightBlue : "transparent",
                          color: activeFilter === filter ? OCHA_COLORS.white : OCHA_COLORS.gray,
                          border: "none",
                          borderRadius: "4px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          transition: "background-color 0.2s",
                          ...appTextStyle,
                        }}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedLocation && (
              <div style={{
                backgroundColor: "#F9F9F9",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                marginTop: "15px",
                borderLeft: `4px solid ${OCHA_COLORS.blue}`,
                ...appTextStyle,
              }}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem", color: OCHA_COLORS.blue, fontWeight: 600 }}>Selected Location</h3>
                <p style={{ margin: "0", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {selectedLocation.address} <br />
                  <small style={{ color: OCHA_COLORS.lightGray, fontSize: "0.8rem" }}>
                    ({selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)})
                  </small>
                </p>
              </div>
            )}

            {getSafetyAnalysis(selectedLocation)}
          </>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          top: "15px",
          left: isSidebarOpen ? `calc(${SIDEBAR_WIDTH_OPEN} + 10px)` : "10px",
          zIndex: 2000,
          padding: "8px",
          backgroundColor: OCHA_COLORS.white,
          color: OCHA_COLORS.blue,
          border: `1px solid ${OCHA_COLORS.lightGray}`,
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          fontSize: "1.2rem",
          transition: `left ${SIDEBAR_TRANSITION_DURATION} ease-in-out, transform ${SIDEBAR_TRANSITION_DURATION} ease-in-out`,
          transform: isSidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          fontFamily: "Arial, sans-serif",
        }}
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? "←" : "→"}
      </button>

      <MapContainer
        center={initialMapCenter}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", background: "#F5F5F5" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='© <a href="https://carto.com/attributions">CARTO</a> <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <MapEventsHandler />
        {userCurrentLocation && (
          <Marker
            position={userCurrentLocation}
            icon={L.divIcon({
              className: "my-location-icon",
              html: `<div style="background-color:${OCHA_COLORS.blue};width:12px;height:12px;border-radius:50%;border:2px solid ${OCHA_COLORS.white};box-shadow:0 0 4px rgba(0,90,138,0.5);"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            })}
          >
            <Popup className="popup-content">Your Current Location</Popup>
          </Marker>
        )}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
            <Popup className="popup-content">
              <strong>Location:</strong> {selectedLocation.address} <br />
              <small>({selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)})</small>
            </Popup>
          </Marker>
        )}
        {isMapReady && visibleDisasters.map((event) => {
          const disasterType = event.disaster_type.toLowerCase();
          const circleColor = disasterIconConfig[disasterType]?.color || OCHA_COLORS.red;
          return (
            <React.Fragment key={event.id}>
              {renderRiskCircle(event.latitude, event.longitude, event.magnitude, circleColor)}
              <Marker
                position={[event.latitude, event.longitude]}
                icon={getDisasterIcon(disasterType, event.magnitude)}
              >
                <Tooltip direction="top" offset={[0, -25]} opacity={1} className="custom-tooltip">
                  <div dangerouslySetInnerHTML={{ __html: getDisasterHoverContent(event) }} />
                </Tooltip>
                <Popup className="popup-content">
                  <strong>{disasterType.charAt(0).toUpperCase() + disasterType.slice(1)}</strong> <br />
                  {disasterType === "earthquake" && `Depth: ${event.depth?.toFixed(1) ?? "N/A"} km`} <br />
                  {disasterType !== "earthquake" && `Magnitude: ${event.magnitude.toFixed(2)}`} <br />
                  Location: {event.place} <br />
                  Time: {new Date(event.time).toLocaleString()} <br />
                  {event.url && <a href={event.url} target="_blank" rel="noopener noreferrer">More Info</a>}
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      <div style={{ position: "absolute", bottom: "10px", right: "10px", zIndex: 1000, display: "flex", gap: "10px" }}>
        <button
          onClick={handleNotificationsClick}
          style={{ ...iconButtonStyle, position: "relative" }}
          title="Notifications"
        >
          <FaBell style={iconStyle} />
          <span>Alerts</span>
          {unreadNotificationsCount > 0 && <span className="notification-badge">{unreadNotificationsCount}</span>}
        </button>
        <button
          onClick={() => setActivePanel("messages")}
          style={iconButtonStyle}
          title="Messages"
        >
          <FaEnvelope style={iconStyle} />
          <span>Messages</span>
        </button>
        <button
          onClick={() => setActivePanel("profile")}
          style={iconButtonStyle}
          title="Profile"
        >
          <FaUser style={iconStyle} />
          <span>Profile</span>
        </button>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowMoreDropdown(!showMoreDropdown)}
            style={iconButtonStyle}
            title="More Options"
          >
            <FaEllipsisH style={iconStyle} />
            <span>More</span>
          </button>
          {showMoreDropdown && (
            <div style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              backgroundColor: OCHA_COLORS.white,
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              padding: "8px",
              zIndex: 1050,
              minWidth: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}>
              <button
                onClick={() => {
                  window.open("https://www.redcross.org/store/emergency-preparedness.html", "_blank");
                  setShowMoreDropdown(false);
                }}
                style={{
                  ...iconButtonStyle,
                  width: "auto",
                  height: "auto",
                  padding: "8px 12px",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: OCHA_COLORS.blue,
                  fontSize: "0.85rem",
                }}
              >
                🛍️ Emergency Kits
              </button>
              <button
                onClick={() => {
                  alert("Report Incident: Upload photos and details to contribute to real-time disaster mapping.");
                  setShowMoreDropdown(false);
                }}
                style={{
                  ...iconButtonStyle,
                  width: "auto",
                  height: "auto",
                  padding: "8px 12px",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: OCHA_COLORS.blue,
                  fontSize: "0.85rem",
                }}
              >
                📢 Report Incident
              </button>
              <button
                onClick={() => {
                  alert("AI Assistant: Get personalized safety advice and evacuation routes based on your location.");
                  setShowMoreDropdown(false);
                }}
                style={{
                  ...iconButtonStyle,
                  width: "auto",
                  height: "auto",
                  padding: "8px 12px",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  color: OCHA_COLORS.blue,
                  fontSize: "0.85rem",
                }}
              >
                🤖 AI Assistant
              </button>
            </div>
          )}
        </div>
      </div>

      <RightSidePanel
        isOpen={activePanel === "profile"}
        onClose={() => setActivePanel(null)}
        title="User Profile"
      >
        <UserProfileContent />
      </RightSidePanel>

      <RightSidePanel
        isOpen={activePanel === "notifications"}
        onClose={() => setActivePanel(null)}
        title="Alerts"
      >
        <NotificationsPanel alerts={allActiveAlerts} />
      </RightSidePanel>

      <RightSidePanel
        isOpen={activePanel === "messages"}
        onClose={() => setActivePanel(null)}
        title="Messages"
      >
        <MessagesPanel />
      </RightSidePanel>
    </div>
  );
};

export default MapComponent;