import * as React from "react";
import { useEffect, useRef, useState } from "react";

// Define the DisasterEvent interface
interface DisasterEvent {
  id: string;
  disaster_type: string;
  latitude: number;
  longitude: number;
  time: number; // Unix timestamp or milliseconds
  magnitude: number | null; // Allow null for flexibility
  // Add other properties as per your actual data structure
}

interface TooltipProps {
  event: DisasterEvent;
  disasterData: DisasterEvent[]; // All available disaster events for trend calculation
  onClose: () => void;
  userLocation?: { latitude: number; longitude: number }; // Optional user location for proximity check
  zoomLevel?: number; // Current map zoom level
  userName?: string; // User's name for message storage
  onAddMessage?: (message: { text: string; timestamp: number; userName: string }) => void; // Callback to add message
}

const TooltipComponent: React.FC<TooltipProps> = ({
  event,
  disasterData,
  onClose,
  userLocation,
  zoomLevel = 13, // Default zoom level
  userName = "Anonymous",
  onAddMessage,
}) => {
  const [localSummary, setLocalSummary] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<{ text: string; color: string }>({ text: "Unknown", color: "text-gray-500" });
  const [advice, setAdvice] = useState<string>("");
  const [isAdviceLoading, setIsAdviceLoading] = useState<boolean>(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [showAdviceButton, setShowAdviceButton] = useState<boolean>(true);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false); // Control chat window visibility
  const [trendData, setTrendData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effect to generate summary and risk level based on zoom and proximity
  useEffect(() => {
    if (!event || !event.latitude || !event.longitude || event.magnitude === null) {
      setLocalSummary("Incomplete event data.");
      setRiskLevel({ text: "Unknown", color: "text-gray-500" });
      return;
    }

    // Calculate proximity to user (if location is provided)
    const proximityRisk = userLocation
      ? calculateProximityRisk(event.latitude, event.longitude, userLocation.latitude, userLocation.longitude)
      : 0;
    const zoomFactor = zoomLevel >= 15 ? 1.5 : zoomLevel >= 12 ? 1.0 : 0.5; // Adjust risk based on zoom
    const baseRisk = event.magnitude || 0;

    // Determine overall risk
    const totalRisk = (baseRisk + proximityRisk) * zoomFactor;
    let riskText: string;
    let riskColor: string;
    if (totalRisk >= 10) {
      riskText = "High Risk";
      riskColor = "text-red-600";
    } else if (totalRisk >= 5) {
      riskText = "Moderate Risk";
      riskColor = "text-orange-500";
    } else {
      riskText = "Low Risk";
      riskColor = "text-blue-600";
    }
    setRiskLevel({ text: riskText, color: riskColor });

    // Generate summary
    const summaryText = `A ${event.disaster_type} (Magnitude: ${event.magnitude || "N/A"}) occurred at Lat ${event.latitude}, Lon ${event.longitude} on ${new Date(event.time).toLocaleDateString()}. Risk: ${riskText} (Zoom: ${zoomLevel}, Proximity: ${proximityRisk.toFixed(1)}km).`;
    setLocalSummary(summaryText);

    // Reset advice states and open chat if data is valid
    setAdvice("");
    setIsAdviceLoading(false);
    setAdviceError(null);
    setShowAdviceButton(true);
    setIsChatOpen(true); // Open chat when data is valid
  }, [event, userLocation, zoomLevel]);

  // Calculate proximity risk (distance in km, simplified)
  const calculateProximityRisk = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance <= 50 ? (50 - distance) / 10 : 0; // Higher risk if closer than 50km
  };

  // Fetch AI-generated advice
  const fetchGeminiAdvice = async () => {
    setIsAdviceLoading(true);
    setAdviceError(null);
    setShowAdviceButton(false);

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const prompt = `
        Provide concise, actionable advice for a ${event.disaster_type} disaster with ${riskLevel.text.toLowerCase()} risk. Focus on preventive measures or immediate actions.
      `;
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];

      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              advice: { type: "STRING", description: "Practical advice related to the disaster type and risk level." },
            },
            required: ["advice"],
          },
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error?.message || "Unknown error"}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts) {
        const jsonString = result.candidates[0].content.parts[0].text;
        const parsedData = JSON.parse(jsonString);
        const newAdvice = parsedData.advice || "No advice available.";
        setAdvice(newAdvice);

        // Store advice in messages if callback is provided
        if (onAddMessage) {
          onAddMessage({
            text: `${userName} received advice: ${newAdvice} for ${event.disaster_type} (${riskLevel.text})`,
            timestamp: Date.now(),
            userName,
          });
        }
      } else {
        setAdvice("Failed to get valid advice from the AI.");
      }
    } catch (err: any) {
      setAdviceError(`Failed to fetch advice: ${err.message}`);
      setAdvice("Failed to fetch advice.");
    } finally {
      setIsAdviceLoading(false);
    }
  };

  // Calculate trend data
  useEffect(() => {
    if (disasterData && disasterData.length > 0) {
      const sevenDaysAgo = event.time - 7 * 24 * 60 * 60 * 1000;
      const recentEvents = disasterData
        .filter(d => d.disaster_type === event.disaster_type && d.time >= sevenDaysAgo && d.time <= event.time)
        .sort((a, b) => a.time - b.time);
      const magnitudes = recentEvents.map(d => d.magnitude || 0);
      setTrendData(magnitudes.length > 0 ? magnitudes : [event.magnitude || 0]);
    } else {
      setTrendData([event.magnitude || 0]);
    }
  }, [event, disasterData]);

  // Draw trend on canvas
  useEffect(() => {
    if (canvasRef.current && trendData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = "#005A8A";
        ctx.lineWidth = 2;
        const minVal = Math.min(...trendData);
        const maxVal = Math.max(...trendData);
        const range = maxVal - minVal > 0 ? maxVal - minVal : 1;
        trendData.forEach((value, index) => {
          const x = (index / (trendData.length - 1)) * canvas.width;
          const y = canvas.height - ((value - minVal) / range) * canvas.height;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.fillStyle = "#005A8A";
        trendData.forEach((value, index) => {
          const x = (index / (trendData.length - 1)) * canvas.width;
          const y = canvas.height - ((value - minVal) / range) * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }
  }, [trendData]);

  // Auto-fetch advice for high risk
  useEffect(() => {
    if (riskLevel.text === "High Risk" && advice === "" && !isAdviceLoading) {
      fetchGeminiAdvice();
    }
  }, [riskLevel.text, advice, isAdviceLoading]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg font-inter text-gray-700 max-w-sm relative z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-5 h-5 bg-none border-none text-gray-700 text-xl cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        ×
      </button>
      <h3 className="mt-0 mb-2 text-blue-800 text-lg font-semibold">
        {event.disaster_type} - {new Date(event.time).toLocaleDateString()}
      </h3>
      <p className="my-2 text-gray-800 text-sm">{localSummary}</p>
      <h4 className="mt-4 mb-1 text-blue-700 text-base font-medium">Risk Level</h4>
      <p className={`my-2 text-sm font-semibold ${riskLevel.color}`}>{riskLevel.text}</p>
      <h4 className="mt-4 mb-1 text-blue-700 text-base font-medium">Trend (Last 7 Days)</h4>
      <canvas
        ref={canvasRef}
        width="280"
        height="100"
        className="my-2 border border-gray-200 rounded-md w-full"
        style={{ display: trendData.length > 0 ? "block" : "none" }}
      />
      {trendData.length === 0 && <p className="text-gray-500 text-sm italic">No trend data available.</p>}

      {/* Chat Window Dropdown */}
      {isChatOpen && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="mb-1 text-blue-700 text-base font-medium">Chat Summary & Advice</h4>
          {riskLevel.text === "High Risk" && advice === "" && (
            <p className="text-red-600 text-sm font-medium">Immediate Danger! Fetching advice...</p>
          )}
          {advice !== "" && (
            <p className={`my-2 text-sm ${riskLevel.color === "text-red-600" ? "text-red-600" : riskLevel.color === "text-orange-500" ? "text-orange-500" : "text-blue-600"}`}>
              {advice}
            </p>
          )}
          {(riskLevel.text === "Moderate Risk" || riskLevel.text === "Low Risk") && showAdviceButton && (
            <button
              onClick={fetchGeminiAdvice}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
              disabled={isAdviceLoading}
            >
              {isAdviceLoading ? "Loading Advice..." : "Get Advice"}
            </button>
          )}
          {isAdviceLoading && riskLevel.text !== "High Risk" && <p className="italic text-gray-500">Loading advice...</p>}
          {adviceError && <p className="text-red-600 text-sm">{adviceError}</p>}
        </div>
      )}
    </div>
  );
};

export default TooltipComponent;