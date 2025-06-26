"use client";

import { useEffect, useState, useRef } from "react";
import { FaExclamationCircle, FaSpinner, FaSync, FaGlobe, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import emergencyIcon from "../../../../assets/icons/emergency.png";

// Using environment variable for API URL
const DISASTER_API_URL = process.env.NEXT_PUBLIC_DISASTER_API_URL || "https://michael-1044744936985.us-central1.run.app/chat";

interface DisasterSummary {
  events: {
    id: string;
    type: string;
    location: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    timestamp: string;
    impactedArea: string;
  }[];
  lastUpdated: string;
}

function DisasterSummaryFloater({ 
  summaryOpen, 
  onChatOpen,
  onQueryChat,
}: { 
  summaryOpen: boolean; 
  onChatOpen: () => void;
  onQueryChat: (query: string) => void;
}) {
  const [summary, setSummary] = useState<DisasterSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summaryOpen) {
      setIsVisible(true);
      if (!summary) {
        fetchDisasterSummary();
      }
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [summaryOpen]);

  const fetchDisasterSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(DISASTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: "Provide a summary of current disaster events in JSON format", 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      try {
        const extractedJson = data.analysis.match(/```json\n([\s\S]*?)\n```/) || 
                             data.analysis.match(/\{[\s\S]*\}/);
        
        if (extractedJson) {
          const jsonString = extractedJson[1] || extractedJson[0];
          const parsedSummary = JSON.parse(jsonString);
          setSummary(parsedSummary);
        } else {
          throw new Error("Could not extract JSON summary from response");
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        setError("Failed to parse disaster summary data");
      }
      
    } catch (error) {
      console.error("Disaster summary API error:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch disaster summary");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "high":
        return "bg-red-100 text-red-800";
      case "critical":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLearnMore = (eventType: string, location: string) => {
    const query = `Tell me more about the ${eventType} in ${location}`;
    onQueryChat(query);
    onChatOpen();
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={summaryRef}
      className={`fixed left-0 top-0 h-full max-w-[350px] w-full z-40 transition-transform duration-300 ${
        summaryOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="bg-[#ffff]/80 p-4 flex flex-col gap-3 h-full shadow-lg overflow-hidden backdrop-blur-md border-r border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src={emergencyIcon || "/placeholder.svg"} 
              width={28} 
              height={28} 
              alt="Emergency icon" 
            />
            <h2 className="text-lg font-bold text-gray-800">Disaster Events</h2>
          </div>
          <button
            onClick={fetchDisasterSummary}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Refresh summary"
          >
            {loading ? (
              <FaSpinner className="animate-spin text-gray-600" />
            ) : (
              <FaSync className="text-gray-600" />
            )}
          </button>
        </div>
        
        {summary?.lastUpdated && (
          <p className="text-xs text-gray-500 italic">
            Last updated: {new Date(summary.lastUpdated).toLocaleString()}
          </p>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-2 rounded">
            <div className="flex items-start">
              <FaExclamationCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="disaster-events overflow-y-auto flex-1">
          {loading && !summary ? (
            <div className="h-full flex flex-col items-center justify-center">
              <FaSpinner className="animate-spin text-3xl text-gray-400 mb-3" />
              <p className="text-gray-500">Loading disaster summaries...</p>
            </div>
          ) : !summary || summary.events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <FaGlobe className="text-3xl text-gray-400 mb-3" />
              <p className="text-gray-500">No active disaster events reported</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {summary.events.map((event) => (
                <li key={event.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{event.type}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadge(event.severity)}`}>
                      {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm text-gray-800">{event.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Location:</span> {event.location}
                    </div>
                    <div>
                      <span className="font-medium">Impacted Area:</span> {event.impactedArea}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs mb-3">
                    <span className="text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLearnMore(event.type, event.location)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    <span>Learn More</span>
                    <FaArrowRight size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-xs text-center text-gray-500 mt-2">
          Click &quot;Learn More&quot; to ask Michael about any disaster event
        </div>
      </div>
    </div>
  );
}

export default DisasterSummaryFloater;