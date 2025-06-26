"use client";
import Image from "next/image";
import React, { useRef, useEffect } from "react";

const mapTypes = [
  {
    id: "roadmap",
    name: "Default",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2374828f'%3E%3Cpath d='M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z'/%3E%3C/svg%3E",
  },
  {
    id: "satellite",
    name: "Satellite",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2374828f'%3E%3Cpath d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'/%3E%3C/svg%3E",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2374828f'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z'/%3E%3C/svg%3E",
  },
  {
    id: "terrain",
    name: "Terrain",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2374828f'%3E%3Cpath d='M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z'/%3E%3C/svg%3E",
  },
];

const MapTypeModal = ({ isOpen, onClose, onSelectMapType, buttonRef }: any) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!buttonRef?.current || !modalRef?.current) return;

      if (
        !modalRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      )
        onClose();
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen || !buttonRef?.current) return null;

  const buttonRect = buttonRef.current.getBoundingClientRect();
  const modalOffset = 15;

  return (
    <div
      ref={modalRef}
      className="fixed z-50 bg-white/30 backdrop-blur-sm rounded-lg shadow-lg overflow-visible w-48 left-[6rem]"
      style={{
        bottom: `${window.innerHeight - buttonRect.top + modalOffset}px`,
        // left: `${buttonRect.left + (buttonRect.width - 19) / 2}px`,
      }}
    >
      <div className="p-2">
        <div className="grid grid-cols-1 gap-1">
          {mapTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onSelectMapType(type.id);
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-200 w-full"
            >
              <div className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50">
                <Image width="20" height="20" src={type.icon} alt={type.name} />
              </div>
              <span className="text-sm text-gray-700">{type.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapTypeModal;
