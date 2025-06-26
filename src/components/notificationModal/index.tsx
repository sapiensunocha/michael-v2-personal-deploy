import { useUserLocation } from "@/helpers/useUserLocation";
import { useFetchCurrentUserProfile } from "@/hooks/useFetchCurrentUserProfile";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const NotificationModal = () => {
  const [notification, setNotification] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const userLocation = useUserLocation();
  const { user } = useFetchCurrentUserProfile();

  // Fetch alert from API
  const fetchAlert = async () => {
    try {
      const response = await axios.get(
        `/api/summary-ai?longitude=${userLocation?.longitude}&latitude=${userLocation?.latitude}`,
      );

      setNotification(response.data.completion || "No alerts available.");
      setIsVisible(true);
    } catch (error) {
      console.error("Failed to fetch alert:", error);
    }
  };
  useEffect(() => {
    if (!notification && userLocation) fetchAlert();

    let interval: any;
    if (isVisible) {
      let timeLeft = 100;
      interval = setInterval(() => {
        if (!isHovered) {
          timeLeft -= 5;
          setProgress(timeLeft);
          if (timeLeft <= 0) {
            setIsVisible(false);
            clearInterval(interval);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isVisible, isHovered, notification, userLocation]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="fixed bottom-[10%] right-5 w-[22rem] bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-5 shadow-xl z-50 text-gray-900 dark:text-white dark:bg-black/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-1 bg-gray-300/50 dark:bg-gray-700/50 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          <X className="w-4 h-4 text-gray-700 dark:text-white" />
        </button>
        <div className="w-full h-1.5 bg-gray-300/50 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-red-700"
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 1 }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            🔔 Alert
          </h2>
          <div className="p-3 bg-red-500/10 dark:bg-red-700/10 rounded-lg border border-red-500/30">
            <p className="text-sm font-semibold">
              {notification || "No notifications"}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationModal;
