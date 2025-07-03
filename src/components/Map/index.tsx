"use client";

import * as L from "leaflet";
import * as React from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { latLng, divIcon } from "leaflet";
import { useState, useRef, useEffect, lazy, Suspense } from "react";
import "leaflet/dist/leaflet.css";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setSelectedLocation } from "@/redux/slice/location";
import RightSidePanel from "../RightSidePanel";
import UserProfileContent from "../UserProfileContent";
import NotificationsPanel from "../NotificationsPanel";
import styled, { keyframes } from "styled-components";
import { DisasterEvent } from "@/types";
import TooltipComponent from "@/components/Map/TooltipComponent";

// Dynamic imports for react-leaflet components with SSR disabled
const LazyMapContainer = dynamic(
  () => import("react-leaflet").then((module) => ({ default: module.MapContainer })),
  { ssr: false }
);
const LazyTileLayer = dynamic(
  () => import("react-leaflet").then((module) => ({ default: module.TileLayer })),
  { ssr: false }
);
const LazyMarker = dynamic(
  () => import("react-leaflet").then((module) => ({ default: module.Marker })),
  { ssr: false }
);
const LazyPopup = dynamic(
  () => import("react-leaflet").then((module) => ({ default: module.Popup })),
  { ssr: false }
);

const OCHA_COLORS = {
  blue: { 500: "#005A8A", 400: "#0077B6", 300: "#00A5CF" },
  red: { 500: "#D1342F", 400: "#D95C5A", 300: "#E18584" },
  yellow: { 500: "#FFC107", 400: "#FFCD38", 300: "#FFD969" },
  gray: { 500: "#4A4A4A", 400: "#6B7280", 300: "#9CA3AF", 100: "#E0E0E0" },
  white: "#FFFFFF",
  neon: "#00FFCC",
};

const SPACING = { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px" };
const TYPOGRAPHY = {
  h1: { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.4 },
  body: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 },
  small: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.5 },
};

const SIDEBAR_WIDTH_OPEN = "360px";
const SIDEBAR_WIDTH_CLOSED = "0px";
const TRANSITION_DURATION = "0.3s";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: ${SPACING.sm} ${SPACING.md} ${SPACING.sm} 40px;
  border-radius: 24px;
  border: 1px solid ${OCHA_COLORS.gray[100]};
  background: linear-gradient(135deg, ${OCHA_COLORS.white} 0%, ${OCHA_COLORS.gray[100]} 100%);
  color: ${OCHA_COLORS.gray[500]};
  font-size: ${TYPOGRAPHY.body.fontSize};
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  font-family: "Orbitron", sans-serif;

  &:focus {
    border-color: ${OCHA_COLORS.blue[300]};
    box-shadow: 0 0 0 4px ${OCHA_COLORS.blue[300]}33;
    transform: translateY(-2px);
  }

  &:hover {
    transform: translateY(-1px);
  }
`;

const IconButton = styled.button`
  padding: ${SPACING.sm};
  background: linear-gradient(135deg, ${OCHA_COLORS.white} 0%, ${OCHA_COLORS.gray[100]} 100%);
  color: ${OCHA_COLORS.blue[300]};
  border: 1px solid ${OCHA_COLORS.gray[100]};
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  width: 48px;
  height: 48px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.3s ease;

  &:hover {
    background: ${OCHA_COLORS.blue[300]};
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 4px 16px rgba(0, 90, 138, 0.3);
    animation: ${pulse} 1.5s infinite;
  }

  &:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: ${OCHA_COLORS.blue[300]};
  color: ${OCHA_COLORS.gray[500]};
  border-radius: 50%;
  padding: 2px 6px;
  font-size: ${TYPOGRAPHY.small.fontSize};
  font-family: "Orbitron", sans-serif;
  box-shadow: 0 0 6px ${OCHA_COLORS.blue[300]};
`;

const LoadingSpinner = styled.div`
  position: absolute;
  right: ${SPACING.md};
  top: 50%;
  transform: translateY(-50%);
  border: 2px solid ${OCHA_COLORS.gray[100]};
  border-top: 2px solid ${OCHA_COLORS.blue[300]};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: ${spin} 1s linear infinite;
`;

const MapSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3000;
  background: linear-gradient(135deg, ${OCHA_COLORS.white} 0%, ${OCHA_COLORS.gray[100]} 100%);
  padding: ${SPACING.lg};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: ${pulse} 2s infinite;
`;

const MapSpinnerInner = styled.div`
  border: 4px solid ${OCHA_COLORS.gray[100]};
  border-top: 4px solid ${OCHA_COLORS.blue[300]};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const ErrorAlert = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
  color: ${OCHA_COLORS.red[500]};
  font-family: "Orbitron", sans-serif";
  background: ${OCHA_COLORS.white};
  padding: ${SPACING.sm};
  border-radius: 8px;
`;

const ErrorCloseButton = styled.button`
  padding: ${SPACING.xs} ${SPACING.sm};
  border: none;
  border-radius: 4px;
  background: ${OCHA_COLORS.blue[300]};
  color: ${OCHA_COLORS.white};
  cursor: pointer;
  font-size: ${TYPOGRAPHY.body.fontSize};
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${OCHA_COLORS.blue[500]};
    transform: scale(1.05);
  }
`;

const SearchResults = styled.div<{ isvisible: boolean }>`
  position: absolute;
  top: calc(${SPACING.md} + 48px);
  left: ${SPACING.md};
  right: ${SPACING.md};
  background: linear-gradient(135deg, ${OCHA_COLORS.white} 0%, ${OCHA_COLORS.gray[100]} 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1500;
  display: ${({ isvisible }) => (isvisible ? "block" : "none")};
  animation: ${fadeIn} 0.3s ease;
`;

const ResultItem = styled.div`
  padding: ${SPACING.sm};
  cursor: pointer;
  font-family: "Orbitron", sans-serif;
  font-size: ${TYPOGRAPHY.body.fontSize};
  color: ${OCHA_COLORS.gray[500]};
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${OCHA_COLORS.blue[300]};
    color: ${OCHA_COLORS.white};
    transform: translateX(4px);
  }
`;

const PanelContainer = styled.div`
  position: absolute;
  bottom: ${SPACING.md};
  left: ${SPACING.md};
  width: 320px;
  height: 400px;
  background: linear-gradient(135deg, ${OCHA_COLORS.white} 0%, ${OCHA_COLORS.gray[100]} 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: ${SPACING.md};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  z-index: 1000;
  font-family: "Orbitron", sans-serif;
  color: ${OCHA_COLORS.gray[500]};
  overflow-y: auto;
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 90, 138, 0.3);
  }
`;

const SectionHeader = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: ${OCHA_COLORS.blue[300]};
  border-bottom: 2px solid ${OCHA_COLORS.gray[100]};
  padding-bottom: ${SPACING.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  padding: ${SPACING.sm} 0;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
  font-size: ${TYPOGRAPHY.body.fontSize};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${OCHA_COLORS.blue[300]};
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
`;

const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.checked ? OCHA_COLORS.blue[300] : OCHA_COLORS.gray[300]};
  transition: background 0.4s ease, transform 0.4s ease;
  border-radius: 24px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background: ${OCHA_COLORS.white};
    transition: transform 0.4s ease;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    transform: ${props => props.checked ? "translateX(24px)" : "translateX(0)"};
  }
`;

const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
`;

const RangeInput = styled.input.attrs({ type: "range" })`
  flex-grow: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, ${OCHA_COLORS.blue[300]} 0%, ${OCHA_COLORS.blue[300]} 100%);
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: ${OCHA_COLORS.blue[300]};
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const LegendItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
  cursor: pointer;
  padding: ${SPACING.sm} ${SPACING.md};
  border-radius: 8px;
  background: ${props => props.selected ? OCHA_COLORS.blue[300] : "transparent"};
  color: ${props => props.selected ? OCHA_COLORS.white : OCHA_COLORS.gray[500]};
  font-weight: ${props => props.selected ? 600 : 400};
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: ${OCHA_COLORS.blue[300]};
    color: ${OCHA_COLORS.white};
    transform: translateX(4px);
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: ${SPACING.md};
  left: ${SPACING.md};
  z-index: 1500;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

interface SelectedLocation {
  lat: number;
  lon: number;
  address: string;
}

interface MapProps {
  data: DisasterEvent[];
}

const MapComponent: React.FC<MapProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedLocation = useSelector((state: RootState) => state.location.selectedLocation) as SelectedLocation | null;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState<"profile" | "notifications" | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [initialMapCenter, setInitialMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [userCurrentLocation, setUserCurrentLocation] = useState<any | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [disasterData, setDisasterData] = useState<DisasterEvent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SelectedLocation[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DisasterEvent | null>(null);
  const [isExtendedCoverage, setIsExtendedCoverage] = useState(true);
  const [inundationProbability, setInundationProbability] = useState(50);
  const [selectedDisasterType, setSelectedDisasterType] = useState<string | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("🔍 mapRef.current on mount:", mapRef.current);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      console.log("✅ MAP CENTER ON LOAD:", mapRef.current.getCenter());
      console.log("✅ MAP ZOOM ON LOAD:", mapRef.current.getZoom());
    } else {
      console.log("❌ mapRef.current is null on load");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        console.log("🟢 Cleaning up map instance");
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (L.Icon.Default.prototype) {
      delete (L.Icon.Default as any).prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
        iconUrl: "/leaflet/images/marker-icon.png",
        shadowUrl: "/leaflet/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    }
  }, []);

  useEffect(() => {
    if (!mapboxToken) {
      setErrorMessage("Mapbox token is missing. Please check your environment configuration.");
    }
  }, [mapboxToken]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialMapCenter([latitude, longitude]);
          setUserCurrentLocation([latitude, longitude]);
          if (mapRef.current && mapRef.current.setView) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
        () => {
          setErrorMessage("Could not retrieve your location. Defaulting to San Francisco.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    }
    if (mapRef.current) {
      console.log("MAP CENTER ON LOAD:", mapRef.current.getCenter());
      console.log("MAP ZOOM ON LOAD:", mapRef.current.getZoom());
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/disaster-data/events", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch disaster data");
        const fetchedData: DisasterEvent[] = await response.json();
        setDisasterData(fetchedData); // Load all disasters
      } catch (error) {
        setErrorMessage("Failed to load disaster data. Using fallback data.");
        setDisasterData(data); // Load all fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [data]);

  const MapEventsHandler: React.FC = () => {
    const map = useMapEvents({
      click: async (e: any) => {
        const { lat, lng } = e.latlng;
        setSelectedEvent(null);
        if (!mapboxToken) {
          setErrorMessage("Mapbox token is missing. Address lookup is disabled.");
          return;
        }
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`,
          );
          if (!response.ok) throw new Error("Reverse geocoding failed");
          const data = await response.json();
          const address = data.features[0]?.place_name || null;
          if (address) {
            dispatch(setSelectedLocation({ lat, lon: lng, address }));
          } else {
            dispatch(setSelectedLocation(null));
            setErrorMessage("No valid address found for this location.");
          }
        } catch {
          dispatch(setSelectedLocation(null));
          setErrorMessage("Failed to retrieve address. Marker not set.");
        }
      },
      load: () => {
        setIsMapReady(true);
        console.log("🟢 MapEventsHandler: Map loaded");
      },
    });
    useEffect(() => {
      if (map) {
        mapRef.current = map;
        (window as any).mapRef = map;
        console.log("✅ MapEventsHandler: mapRef.current set and exposed to window.mapRef");
        console.log("✅ MapEventsHandler: mapRef.current set:", mapRef.current.getCenter());
      }
    }, [map]);
    return null;
  };

  const ZoomControl: React.FC = () => {
    const map = useMap();
    return (
      <div style={{
        position: "absolute",
        bottom: isMobile ? SPACING.md : "80px", // Moved to bottom-right for mobile
        right: SPACING.md,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: SPACING.xs,
      }}>
        <IconButton
          onClick={() => {
            map.zoomIn();
          }}
          aria-label="Zoom in"
        >
          +
        </IconButton>
        <IconButton
          onClick={() => {
            map.zoomOut();
          }}
          aria-label="Zoom out"
        >
          −
        </IconButton>
      </div>
    );
  };

  useEffect(() => {
    if (mapRef.current && selectedLocation && selectedLocation.address) {
      const currentCenter = mapRef.current.getCenter();
      const distance = currentCenter.distanceTo(latLng(selectedLocation.lat, selectedLocation.lon));
      if (distance > 500) {
        mapRef.current.setView([selectedLocation.lat, selectedLocation.lon], 13, { animate: true, duration: 1 });
      }
    }
  }, [selectedLocation]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    if (!mapboxToken) {
      setErrorMessage("Mapbox token is missing. Search functionality is disabled.");
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${mapboxToken}&limit=5`,
      );
      if (!response.ok) throw new Error("Geocoding failed");
      const data = await response.json();
      if (data.features.length > 0) {
        const results = data.features.map((feature: any) => ({
          lat: feature.center[1],
          lon: feature.center[0],
          address: feature.place_name,
        }));
        setSearchResults(results);
      } else {
        setSearchResults([]);
        setErrorMessage("No results found. Please try another query.");
      }
    } catch {
      setSearchResults([]);
      setErrorMessage("Search failed. Please check your query and internet connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: SelectedLocation) => {
    dispatch(setSelectedLocation(location));
    setSearchTerm("");
    setSearchResults([]);
    if (mapRef.current && mapRef.current.setView) {
      mapRef.current.setView([location.lat, location.lon], 13, { animate: true, duration: 1 });
    }
  };

  const getLocationAnalysis = (lat: number, lon: number) => {
    const nearbyDisasters = disasterData.filter(event => {
      const eventLatLng = latLng(Number(event.latitude), Number(event.longitude));
      const selectedLatLng = latLng(lat, lon);
      return eventLatLng.distanceTo(selectedLatLng) < 200000;
    });
    let riskLevel = "Low";
    let advice = "No significant disaster activity detected nearby.";
    let color = OCHA_COLORS.blue[500];
    if (nearbyDisasters.length > 0) {
      const hasHighRisk = nearbyDisasters.some(event => event.risk_level === "High");
      const hasModerateRisk = nearbyDisasters.some(event => event.risk_level === "Moderate");
      if (hasHighRisk) {
        riskLevel = "High Risk";
        advice = `Significant disaster activity detected (${nearbyDisasters.length} events, including high-risk events).`;
        color = OCHA_COLORS.red[500];
      } else if (hasModerateRisk) {
        riskLevel = "Moderate Risk";
        advice = `Recent disaster activity detected (${nearbyDisasters.length} events).`;
        color = OCHA_COLORS.yellow[500];
      } else {
        riskLevel = "Low Risk";
        advice = `Minor disaster activity detected (${nearbyDisasters.length} events).`;
        color = OCHA_COLORS.blue[500];
      }
    }
    return { riskLevel, advice, color };
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNotificationsClick = () => {
    setActivePanel("notifications");
    setUnreadNotificationsCount(0);
  };

  const allActiveAlerts = () => {
    return disasterData.filter((event: DisasterEvent) => event.time >= (Date.now() - 24 * 60 * 60 * 1000)).map(event => ({
      id: event.id,
      type: event.disaster_type,
      title: event.disaster_type,
      time: event.time,
      link: event.url,
      details: event.summary,
    })).sort((a, b) => b.time - a.time);
  };
  useEffect(() => {
    setUnreadNotificationsCount(allActiveAlerts().length);
  }, [disasterData]);

  const appTextStyle: React.CSSProperties = {
    fontFamily: "\"Orbitron\", sans-serif",
    color: OCHA_COLORS.gray[500],
    lineHeight: 1.6,
  };

  const getDisasterIcon = (disasterType: string) => {
    const typeLower = disasterType.toLowerCase();
    let iconUrl = "/icons/disaster.png";
    if (typeLower.includes("earthquake")) iconUrl = "/icons/earthquake.png";
    else if (typeLower.includes("flood")) iconUrl = "/icons/flood.png";
    else if (typeLower.includes("tropical cyclone")) iconUrl = "/icons/cyclone1.png";
    else if (typeLower.includes("wildfire")) iconUrl = "/icons/wildfire.png";
    else if (typeLower.includes("drought")) iconUrl = "/icons/drought.png";
    else if (typeLower.includes("violence") || typeLower.includes("battles")) iconUrl = "/icons/politic1.png";
    else if (typeLower.includes("protests") || typeLower.includes("demonstration") || typeLower.includes("riots")) iconUrl = "/icons/demonstration.png";
    else if (typeLower.includes("explosions") || typeLower.includes("remote violence")) iconUrl = "/icons/Political.png";
    else if (typeLower.includes("strategic developments")) iconUrl = "/icons/Development.png";
    else if (typeLower.includes("violence against civilians")) iconUrl = "/icons/Political.png";
    return divIcon({
      className: "custom-icon",
      html: `<img src="${iconUrl}" style="width: 30px; height: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" />`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const handleToggleExtendedCoverage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsExtendedCoverage(e.target.checked);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInundationProbability(value);
  };

  const handleSelectDisasterType = (type: string) => {
    setSelectedDisasterType(type === selectedDisasterType ? null : type);
  };

  const visibleDisasters = disasterData.filter((event: DisasterEvent) => {
    if (selectedDisasterType && event.disaster_type.toLowerCase() !== selectedDisasterType.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden", ...appTextStyle }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%", position: "relative" }}>
        {errorMessage && (
          <div
            style={{
              position: "absolute",
              top: SPACING.lg,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3000,
              background: OCHA_COLORS.white,
              padding: SPACING.md,
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              color: OCHA_COLORS.red[500],
              display: "flex",
              alignItems: "center",
              gap: SPACING.sm,
              fontFamily: "\"Orbitron\", sans-serif",
            }}
          >
            <ErrorAlert>{errorMessage}</ErrorAlert>
            <ErrorCloseButton onClick={() => setErrorMessage(null)}>Close</ErrorCloseButton>
          </div>
        )}
        <SearchContainer>
          <Image
            src="/logo icon.png"
            alt="App Logo"
            width={60}
            height={60}
            style={{
              borderRadius: "12px",
              background: OCHA_COLORS.white,
              padding: SPACING.sm,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "rotate(5deg)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "rotate(0deg)")}
          />
          <form onSubmit={handleSearch} style={{ position: "relative", width: "320px" }}>
            <FaSearch
              style={{
                position: "absolute",
                left: SPACING.md,
                top: "50%",
                transform: "translateY(-50%)",
                color: OCHA_COLORS.blue[300],
                fontSize: "1.2rem",
                transition: "color 0.2s ease",
              }}
            />
            <SearchInput
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Explore locations..."
              disabled={isSearching}
              aria-label="Search location"
            />
            {isSearching && <LoadingSpinner />}
          </form>
          {searchResults.length > 0 && (
            <SearchResults isvisible={true}>
              {searchResults.map((result: SelectedLocation, index: number) => {
                const analysis = getLocationAnalysis(result.lat, result.lon);
                return (
                  <ResultItem key={index} onClick={() => handleSelectLocation(result)}>
                    {result.address}
                    <div style={{ color: analysis.color, fontSize: TYPOGRAPHY.small.fontSize }}>
                      {analysis.riskLevel}: {analysis.advice}
                    </div>
                  </ResultItem>
                );
              })}
            </SearchResults>
          )}
        </SearchContainer>
        {isMobile && (
          <IconButton
            onClick={toggleSidebar}
            style={{
              position: "absolute",
              top: SPACING.md,
              left: SPACING.md,
              zIndex: 2000,
              background: OCHA_COLORS.white,
            }}
            aria-label="Toggle sidebar"
          >
            ☰
          </IconButton>
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: isSidebarOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED,
            background: `linear-gradient(180deg, ${OCHA_COLORS.white} 0%, ${OCHA_COLORS.gray[100]} 100%)`,
            color: OCHA_COLORS.gray[500],
            zIndex: 1500,
            transition: `width ${TRANSITION_DURATION} ease-in-out, transform ${TRANSITION_DURATION} ease-in-out`,
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-20px)",
            overflowX: "hidden",
            padding: isSidebarOpen ? SPACING.lg : "0",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: SPACING.md,
            boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
            ...(isMobile && {
              width: isSidebarOpen ? "100%" : SIDEBAR_WIDTH_CLOSED,
              maxWidth: "360px",
            }),
          }}
        >
          {isSidebarOpen && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: SPACING.sm,
                  paddingBottom: SPACING.md,
                  borderBottom: `1px solid ${OCHA_COLORS.gray[100]}`,
                }}
              >
                <Image src="/logo icon.png" alt="App Logo" width={40} height={40} />
                <h1 style={{ ...TYPOGRAPHY.h1, color: OCHA_COLORS.blue[300] }}>Disaster Horizon</h1>
              </div>
              <form onSubmit={handleSearch} style={{ display: "flex", flexGrow: 1, position: "relative" }}>
                <FaSearch
                  style={{
                    position: "absolute",
                    left: SPACING.md,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: OCHA_COLORS.blue[300],
                    fontSize: "1.2rem",
                  }}
                />
                <SearchInput
                  type="text"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  placeholder="Explore locations..."
                  disabled={isSearching}
                  aria-label="Search location"
                />
                {isSearching && <LoadingSpinner />}
              </form>
            </>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            top: SPACING.md,
            right: SPACING.md,
            zIndex: 1000,
            display: "flex",
            gap: SPACING.sm,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <IconButton
            onClick={handleNotificationsClick}
            aria-label="Notifications"
            title="Notifications"
            style={{ position: "relative" }}
          >
            <FaBell />
            {unreadNotificationsCount > 0 && <NotificationBadge>{unreadNotificationsCount}</NotificationBadge>}
          </IconButton>
          <IconButton
            onClick={() => setActivePanel("profile")}
            aria-label="Profile"
            title="Profile"
          >
            <FaUser />
          </IconButton>
        </div>
        {isLoading && (
          <MapSpinner>
            <MapSpinnerInner />
          </MapSpinner>
        )}
        <Suspense fallback={<MapSpinner><MapSpinnerInner /></MapSpinner>}>
          <LazyMapContainer
            ref={mapRef}
            center={initialMapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", background: OCHA_COLORS.gray[100] }}
            zoomControl={false}
            whenReady={() => {
              if (mapRef.current) {
                console.log("✅ MAP IS READY:", mapRef.current.getCenter(), "Zoom:", mapRef.current.getZoom());
                mapRef.current.setView(initialMapCenter, 13);
              }
            }}
          >
            <LazyTileLayer
              attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={mapboxToken ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}` : ""}
              tileSize={512}
              zoomOffset={-1}
              maxZoom={19}
            />
            <MapEventsHandler />
            <ZoomControl />
            {visibleDisasters.map((event: DisasterEvent, index: number) => (
              <React.Fragment key={event.id}>
                <LazyMarker
                  position={[Number(event.latitude), Number(event.longitude)]}
                  icon={getDisasterIcon(event.disaster_type)}
                  eventHandlers={{
                    click: () => {
                      setSelectedEvent(event);
                    },
                  }}
                >
                  <LazyPopup
                    className="custom-popup"
                    maxWidth={250}
                    maxHeight={200}
                    autoPan={false}
                    closeButton={false}
                    offset={[0, -30]}
                  >
                    <Suspense fallback={<div style={{ padding: "8px" }}>Loading...</div>}>
                      {selectedEvent && (
                        <TooltipComponent
                          event={{
                            ...selectedEvent,
                            magnitude: selectedEvent.magnitude ?? 0,
                          }}
                          disasterData={disasterData.map(event => ({
                            ...event,
                            magnitude: event.magnitude ?? 0,
                          }))}
                          onClose={() => setSelectedEvent(null)}
                        />
                      )}
                    </Suspense>
                  </LazyPopup>
                </LazyMarker>
              </React.Fragment>
            ))}
            {userCurrentLocation && (
              <LazyMarker
                position={userCurrentLocation}
                icon={divIcon({
                  className: "my-location-icon",
                  html: `<div style="background-color:${OCHA_COLORS.blue[500]};width:12px;height:12px;border-radius:50%;border:2px solid ${OCHA_COLORS.white};box-shadow:0 0 4px rgba(0,90,138,0.5);"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6],
                })}
              >
                <LazyPopup className="custom-popup" maxWidth={250} maxHeight={200} autoPan={false} closeButton={false} offset={[0, -30]}>
                  Your Current Location
                </LazyPopup>
              </LazyMarker>
            )}
            {selectedLocation && selectedLocation.address && (
              <LazyMarker
                position={[selectedLocation.lat, selectedLocation.lon]}
                icon={divIcon({
                  className: "selected-location-icon",
                  html: `<div style="background-color:${OCHA_COLORS.blue[300]};width:12px;height:12px;border-radius:50%;border:2px solid ${OCHA_COLORS.white};box-shadow:0 0 6px ${OCHA_COLORS.blue[300]};"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6],
                })}
              >
                <LazyPopup className="custom-popup" maxWidth={250} maxHeight={200} autoPan={false} closeButton={false} offset={[0, -30]}>
                  <strong>Location:</strong> {selectedLocation.address} <br />
                  <small>({selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)})</small>
                </LazyPopup>
              </LazyMarker>
            )}
          </LazyMapContainer>
        </Suspense>

        <PanelContainer>
          <SectionHeader>Map Control Hub</SectionHeader>
          <ControlGroup>
            <Label>
              <ToggleSwitch>
                <CheckboxInput checked={isExtendedCoverage} onChange={handleToggleExtendedCoverage} />
                <Slider checked={isExtendedCoverage} />
              </ToggleSwitch>
              <span>Extended Coverage</span>
            </Label>
          </ControlGroup>
          <ControlGroup>
            <SectionHeader>Disaster Types</SectionHeader>
            <LegendItem selected={selectedDisasterType === "earthquake"} onClick={() => handleSelectDisasterType("earthquake")}>
              <Image src="/icons/earthquake.png" alt="Earthquake" width={20} height={20} />
              <span>Earthquake</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "flood"} onClick={() => handleSelectDisasterType("flood")}>
              <Image src="/icons/flood.png" alt="Flood" width={20} height={20} />
              <span>Flood</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "tropical cyclone"} onClick={() => handleSelectDisasterType("tropical cyclone")}>
              <Image src="/icons/cyclone1.png" alt="Tropical Cyclone" width={20} height={20} />
              <span>Tropical Cyclone</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "wildfire"} onClick={() => handleSelectDisasterType("wildfire")}>
              <Image src="/icons/wildfire.png" alt="Wildfire" width={20} height={20} />
              <span>Wildfire</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "drought"} onClick={() => handleSelectDisasterType("drought")}>
              <Image src="/icons/drought.png" alt="Drought" width={20} height={20} />
              <span>Drought</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "violence"} onClick={() => handleSelectDisasterType("violence")}>
              <Image src="/icons/politic1.png" alt="Violence" width={20} height={20} />
              <span>Violence</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "protests"} onClick={() => handleSelectDisasterType("protests")}>
              <Image src="/icons/demonstration.png" alt="Protests" width={20} height={20} />
              <span>Protests</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "explosions"} onClick={() => handleSelectDisasterType("explosions")}>
              <Image src="/icons/Political.png" alt="Explosions" width={20} height={20} />
              <span>Explosions</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "strategic developments"} onClick={() => handleSelectDisasterType("strategic developments")}>
              <Image src="/icons/Development.png" alt="Strategic Developments" width={20} height={20} />
              <span>Strategic Developments</span>
            </LegendItem>
            <LegendItem selected={selectedDisasterType === "violence against civilians"} onClick={() => handleSelectDisasterType("violence against civilians")}>
              <Image src="/icons/Political.png" alt="Violence Against Civilians" width={20} height={20} />
              <span>Violence Against Civilians</span>
            </LegendItem>
          </ControlGroup>
          <ControlGroup>
            <SectionHeader>Risk Probability</SectionHeader>
            <SliderContainer>
              <RangeInput
                min="0"
                max="100"
                value={inundationProbability}
                onChange={handleSliderChange}
              />
              <span style={{ color: OCHA_COLORS.blue[300] }}>{inundationProbability}%</span>
            </SliderContainer>
          </ControlGroup>
          <ControlGroup>
            <SectionHeader>Risk Levels</SectionHeader>
            <LegendItem selected={false}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: OCHA_COLORS.red[500], opacity: 0.8 }}></div>
              <span>High Risk</span>
            </LegendItem>
            <LegendItem selected={false}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: OCHA_COLORS.yellow[500], opacity: 0.8 }}></div>
              <span>Moderate Risk</span>
            </LegendItem>
            <LegendItem selected={false}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: OCHA_COLORS.blue[500], opacity: 0.8 }}></div>
              <span>Low Risk</span>
            </LegendItem>
          </ControlGroup>
        </PanelContainer>

        <RightSidePanel isOpen={activePanel === "profile"} onClose={() => setActivePanel(null)}>
          <UserProfileContent />
        </RightSidePanel>
        <RightSidePanel isOpen={activePanel === "notifications"} onClose={() => setActivePanel(null)}>
          <NotificationsPanel alerts={allActiveAlerts()} />
        </RightSidePanel>
      </div>
    </div>
  );
};

export default MapComponent;