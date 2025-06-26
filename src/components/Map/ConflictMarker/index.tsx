import PredictionDrawer from "@/components/features/PredictionDrawer";
import { InfoWindow, Marker } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

export interface Conflict {
  id: string;
  location: Location;
  title: string;
  type: string;
  severity: string;
  affectedArea: string;
  date: string;
  description: string;
}

const customIcon = "/icons/Naturel.png";
const conflictIcon = "/icons/Political.png";
const developmentIcon = "/icons/Development.png";
const volcanoIcon = "/icons/Naturel.png";
const earthquakeIcon = "/icons/Earthquake.png";
const droughtIcon = "/icons/Drought.png";
const floodIcon = "/icons/flood.png";
const technologicalIcon = "/icons/Tech.png";
const wildFireIcon = "/icons/fire.png";
const tropicalCycloneIcon = "/icons/cyclone1.png";

const getIconUrl = (category: string) => {
  const iconMap: { [key: string]: string } = {
    conflicts: conflictIcon,
    developments: developmentIcon,
    VO: volcanoIcon,
    EQ: earthquakeIcon,
    DR: droughtIcon,
    FL: floodIcon,
    TE: technologicalIcon,
    WF: wildFireIcon,
    TC: tropicalCycloneIcon,
  };

  return iconMap[category] || customIcon;
};

export default function ConflictMarker({
  incident,
  isActive,
  handleCloseClick,
}: {
  incident: Conflict;
  isActive: boolean;
  handleCloseClick: () => void;
}) {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutId = useRef<any | null>(null);
  const predictionRef = useRef<HTMLDivElement | null>(null);

  const handleMouseOver = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      setIsHovered(true);
    }, 300);
  };

  const handleMouseOut = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setIsHovered(false);
  };

  const handleMarkerClick = () => {
    if (activeDrawerId) {
      setActiveDrawerId((prev) => (prev === incident.id ? null : incident.id));
    } else {
      setActiveDrawerId(incident.id);
    }
  };

  useEffect(() => {
    function handleClickOutSide(event: any) {
      if (
        predictionRef.current &&
        !predictionRef.current.contains(event.target)
      ) {
        setActiveDrawerId(null);
      }
    }
    console.log(activeDrawerId);
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [activeDrawerId]);

  return (
    <>
      <Marker
        position={incident.location}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleMarkerClick}
        icon={{
          url: getIconUrl(incident.type),
          scaledSize: new window.google.maps.Size(30, 30),
        }}
      />

      {(isActive || isHovered) && !activeDrawerId && (
        <InfoWindow
          position={incident.location}
          onCloseClick={handleMouseOut}
          options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
        >
          <div
            className="relative md:p-4- bg-blue-500 backdrop-blur-lg bg-opacity-20 rounded-lg shadow-lg md:w-[20rem] overflow-visible"
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOut}
          >
            <div className="transform bg-red-800 bg-opacity-80 p-6 w-full h-[10rem] overflow-y-scroll rounded-lg mt-2 shadow-lg">
              <h3 className="font-bold text-white text-lg mb-2">
                {incident.title}
              </h3>
              <p className="text-sm text-white pb-2">
                <span className="font-semibold text-xl"></span>{" "}
                {incident.description.split("").slice(0, 100).join("")}
                {"..."}
              </p>
              <p className="text-sm text-white mb-1">
                <span className="font-semibold">Type:</span> {incident.type}
              </p>
              <p className="text-sm text-white mb-1">
                <span className="font-semibold">Severity:</span>{" "}
                {incident.severity}
              </p>
              <p className="text-sm text-white mb-1">
                <span className="font-semibold">Affected Area:</span>{" "}
                {incident.affectedArea}
              </p>
              <p className="text-sm text-white mb-1">
                <span className="font-semibold">Date:</span> {incident.date}
              </p>
            </div>
          </div>
        </InfoWindow>
      )}

      {activeDrawerId === incident.id && (
        <div
          className="border bg-red-500 absolute w-full z-50"
          ref={predictionRef}
        >
          <PredictionDrawer
            title={incident.title}
            isOpen={activeDrawerId === incident.id}
            onClose={() => setActiveDrawerId(null)}
            location={[incident.location.lng, incident.location.lat].join(", ")}
            eventType={incident.type}
            severity={incident.severity}
            index={incident.id}
            region={incident.affectedArea}
            description={incident.description}
          />
        </div>
      )}
    </>
  );
}
