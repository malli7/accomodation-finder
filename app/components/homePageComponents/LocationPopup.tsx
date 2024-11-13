import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

interface LocationPopupProps {
  onSubmit: (e: React.FormEvent) => void;
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}


function LocationPopup({
  onSubmit,
  location,
  setLocation,
}: LocationPopupProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Handle autocomplete instance load
  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  // Triggered when a place is selected
  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      const a = place.formatted_address
        ?.split(",")
        .map((part) => (part.trim() === "USA" ? " United States" : part))
        .join(",");

      console.log(a);
      setLocation(a || ""); // Set location to the formatted address of the place
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Set Your Location</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your city or area
            </label>

            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                types: ["(cities)"], // Only show city-level locations
              }}
            >
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, NY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Autocomplete>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Set Location
          </button>
        </form>
      </div>
    </div>
  );
}

export default LocationPopup;
