import React from "react";
// import ReactDOMServer from 'react-dom/server';
import { Marker, InfoWindow } from "@react-google-maps/api";
import { Icon } from "@iconify/react";
import disasterConfig from "@/helpers/customerMarkerData";

interface Disaster {
  categories: { id: string; title: string }[];
  geometry: { coordinates: number[]; date: string }[];
  title: string;
  sources?: { url: string }[];
}

const CustomMarker = ({
  disaster,
  isActive,
  onClick,
}: {
  disaster: Disaster;
  isActive: boolean;
  onClick: () => void;
}) => {
  const categoryId: keyof typeof disasterConfig =
    disaster.categories[0].id.toLowerCase() as keyof typeof disasterConfig;
  const config = disasterConfig[categoryId] || disasterConfig.default;
  const IconComponent = config.icon;

  // Convert React Icon to URL for Google Maps Marker
  const createMarkerIcon = (config: { color: string }) => ({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="${config.color}" />
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(36, 36),
    anchor: new window.google.maps.Point(18, 18),
  });

  return (
    <Marker
      position={{
        lat: disaster.geometry[0].coordinates[1],
        lng: disaster.geometry[0].coordinates[0],
      }}
      onClick={onClick}
      icon={createMarkerIcon(config)}
    >
      {isActive && (
        <InfoWindow onCloseClick={onClick}>
          <div className="p-4 max-w-sm bg-white rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <IconComponent color={config.color} size={24} />
              <h3 className="text-lg font-bold">{disaster.title}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm flex items-center gap-2">
                <span className="font-semibold">Type:</span>
                {disaster.categories[0].title}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="font-semibold">Date:</span>
                {new Date(disaster.geometry[0].date).toLocaleDateString()}
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="font-semibold">Coordinates:</span>
                <span>
                  {disaster.geometry[0].coordinates[1].toFixed(4)},
                  {disaster.geometry[0].coordinates[0].toFixed(4)}
                </span>
              </p>
              {disaster.sources && disaster.sources.length > 0 && (
                <a
                  href={disaster.sources[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 mt-2"
                >
                  <Icon icon="mdi:link" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default CustomMarker;
