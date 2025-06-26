import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const updateUserLocation = async (location: {
  latitude: number;
  longitude: number;
} | null) => {
  try {
     const response = await axios.put(
      "https://dev-wdc.com/api/v1/user/me",
      location,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response, "response");
  } catch (error) {
    console.error("Error updating user location:", error);
  }
};

const useUpdateUserLocation = () => {
  const { mutate: updateUserLocationMutation } = useMutation<
    void,
    Error,
    { latitude: number; longitude: number } | null
  >({
    mutationFn: updateUserLocation,
    onSuccess: () => {
      console.log("User location updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user location:", error);
    },
  });

  return updateUserLocationMutation;
};

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return userLocation;
};

export { useUserLocation, useUpdateUserLocation };
