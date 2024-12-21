"use client";
import React, { ReactNode, useState, useEffect } from "react";
import AccoLoader from "./AccoLoader";

interface GoogleMapsLoaderProps {
  children: ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({ children }) => {
  const isLoaded = useGoogleMapsLoader(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    ["places"]
  );

  return isLoaded ? <>{children}</> : <AccoLoader />;
};

export default GoogleMapsLoader;

const useGoogleMapsLoader = (apiKey: string, libraries: string[]) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeGoogleMaps = () => {
      if (typeof window !== "undefined" && window.google) {
        setIsLoaded(true);
      }
    };

    // Check if the Google Maps script is already loaded
    const existingScript = document.getElementById("google-maps-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(
        ","
      )}`;
      script.async = true;
      script.defer = true;
      script.id = "google-maps-script"; 
      script.onload = initializeGoogleMaps;
      document.head.appendChild(script);
    } else if (window.google) {
      // If the script is already loaded, set the state immediately
      setIsLoaded(true);
    } else {
      // If the script is still loading, add an onload listener to it
      existingScript.addEventListener("load", initializeGoogleMaps);
    }
  }, [apiKey, libraries]);

  return isLoaded;
};
