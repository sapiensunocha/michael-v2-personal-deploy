/* eslint-disable no-undef */
"use client";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function AnalyserModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [statuses, setStatuses] = useState([
    {
      title: "Initiating AI scan",
      status: "pending",
    },
    {
      title: "AI processing content",
      status: "pending",
    },
    {
      title: "Running deep analysis",
      status: "pending",
    },
    {
      title: "Generating AI insights",
      status: "pending",
    },
  ]);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const updateStatus = () => {
      if (currentIndex < statuses.length) {
        setStatuses((prev) =>
          prev.map((item, index) => ({
            ...item,
            status:
              index === currentIndex
                ? "in-progress"
                : index < currentIndex
                  ? "completed"
                  : "pending",
          })),
        );

        timeoutId = setTimeout(() => {
          setStatuses((prev) =>
            prev.map((item, index) => ({
              ...item,
              status: index <= currentIndex ? "completed" : "pending",
            })),
          );
          currentIndex++;
          if (currentIndex < statuses.length) {
            updateStatus();
          } else {
            onClose();
            router.push("/success");
          }
        }, 3000);
      }
    };

    updateStatus();

    // Cleanup timeout on unmount or status change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold">AI is analysing your data</h3>
      </div>

      <div className="space-y-3 text-xs">
        {statuses.map((status, index) => (
          <div
            key={index}
            className="flex items-center gap-2 transition-all duration-300 ease-in-out"
          >
            <div className="relative h-4 w-4">
              {/* Completed icon */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  status.status === "completed"
                    ? "scale-100 opacity-100"
                    : "scale-0 opacity-0",
                )}
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>

              {/* In progress icon */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  status.status === "in-progress"
                    ? "scale-100 opacity-100"
                    : "scale-0 opacity-0",
                )}
              >
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>

              {/* Pending icon */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  status.status === "pending"
                    ? "scale-100 opacity-100"
                    : "scale-0 opacity-0",
                )}
              >
                <Circle className="h-4 w-4 text-gray-300" />
              </div>
            </div>
            <span
              className={cn(
                "transition-colors duration-300",
                status.status === "completed" && "text-green-600",
                status.status === "in-progress" && "text-blue-600",
              )}
            >
              {status.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
