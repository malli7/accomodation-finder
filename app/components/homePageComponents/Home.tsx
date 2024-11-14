"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Filter, ChevronDown } from "lucide-react";
import LocationPopup from "./LocationPopup";
import AccommodationCard from "./AccommodationCard";
import GoogleMapsLoader from "../GoogleMapsLoader";
import NavBar from "./NavBar";
import Filters from "./Filters";

interface Accommodation {
  id: string;
  title: string;
  address: string;
  city: string;
  zipCode: number;
  description: string;
  bedrooms: string;
  bathrooms: string;
  peopleLiving: string;
  availabilityStart: string;
  availabilityEnd: string;
  amenities: string[];
  rent: string;
  otherCharges: string;
  imageUrls: string[];
  userId: string;
}

export interface Filters {
  bedrooms: string;
  bathrooms: string;
  priceRange: string;
  amenities: string[];
  availabilityStart: string;
  availabilityEnd: string;
  peopleLiving: string;
  otherCharges: string;
}

export default function HomePage() {
  const [showLocationPopup, setShowLocationPopup] = useState(true);
  const [location, setLocation] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    bedrooms: "",
    bathrooms: "",
    priceRange: "",
    amenities: [],
    availabilityStart: "",
    availabilityEnd: "",
    peopleLiving: "",
    otherCharges: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filteredAccommodations, setFilteredAccommodations] = useState<
    Accommodation[]
  >([]);
  const [favorites, setFavorites] = useState<string[]>([]);



  useEffect(() => {
    // Retrieve favorites from the backend on component mount
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/wishlist`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (Array.isArray(data.wishlist)) {
          setFavorites(data.wishlist);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    // Retrieve location from cookie on component mount
    const locationCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("location="))
      ?.split("=")[1];
    if (locationCookie) {
      setLocation(decodeURIComponent(locationCookie));
      setShowLocationPopup(false);
    }
  }, []);

  const fetchAccommodations = async () => {
    if (location) {
      try {
        let url = `/api/listings`;
        if (location) {
          url += `?city=${location}`;
        }
        const response = await fetch(url);
        const data = await response.json();

        // Ensure that `data` is an array before setting state
        if (Array.isArray(data)) {
          setFilteredAccommodations(data);
        
        } else {
          setFilteredAccommodations([]); // Set to empty array if data is not an array
        }
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        setFilteredAccommodations([]); // Set to empty array on error
      }
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, [location]);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLocationPopup(false);
    // Set location cookie with 1-week expiry
    document.cookie = `location=${encodeURIComponent(
      location
    )}; path=/; max-age=${7 * 24 * 60 * 60}`; // 1 week in seconds
    fetchAccommodations();
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((item) => item !== value),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = () => {
    const filtered = filteredAccommodations.filter((acc) => {
      return (
        (!filters.bedrooms ||
          parseInt(acc.bedrooms) >= parseInt(filters.bedrooms)) &&
        (!filters.bathrooms ||
          parseInt(acc.bathrooms) >= parseInt(filters.bathrooms)) &&
        (!filters.priceRange ||
          parseInt(acc.rent) <= parseInt(filters.priceRange)) &&
        (!filters.availabilityStart ||
          new Date(acc.availabilityStart).toDateString() ==
            new Date(filters.availabilityStart).toDateString() ||
          new Date(acc.availabilityStart) <=
            new Date(filters.availabilityStart)) &&
        (!filters.availabilityEnd ||
          new Date(acc.availabilityEnd) >= new Date(filters.availabilityEnd)) &&
        (!filters.peopleLiving ||
          parseInt(acc.peopleLiving) >= parseInt(filters.peopleLiving)) &&
        (!filters.otherCharges ||
          parseInt(acc.otherCharges) <= parseInt(filters.otherCharges)) &&
        (filters.amenities.length === 0 ||
          filters.amenities.every((amenity) => acc.amenities.includes(amenity)))
      );
    });
    setFilteredAccommodations(filtered);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      bedrooms: "",
      bathrooms: "",
      priceRange: "",
      amenities: [],
      availabilityStart: "",
      availabilityEnd: "",
      peopleLiving: "",
      otherCharges: "",
    });
    fetchAccommodations(); // Refetch all listings without filters
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && (Array.isArray(value) ? value.length > 0 : true)
  );

  const toggleFavorite = async (id: string) => {
    try {
      await fetch(`/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
      );
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black ">
      <GoogleMapsLoader>
        {showLocationPopup && (
          <LocationPopup
            onSubmit={handleLocationSubmit}
            location={location}
            setLocation={setLocation}
          />
        )}

        <NavBar />

        <main className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Find Your Perfect Stay</h1>
            <div
              className="flex items-center space-x-2 text-gray-600 cursor-pointer"
              onClick={() => setShowLocationPopup(true)} // Show popup on click
            >
              <MapPin className="w-5 h-5" />
              <span>{location || "Set your location"}</span>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                <ChevronDown className="w-5 h-5" />
              </button>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-800 transition duration-300"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <Filters
              showFilters={showFilters}
              filters={filters}
              handleFilterChange={handleFilterChange}
              applyFilters={applyFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </section>

          <section className="mb-12 w-fit">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccommodations
                ? filteredAccommodations.map((accommodation) => (
                    <AccommodationCard
                      key={accommodation.id}
                      {...accommodation}
                      isFavorite={favorites.includes(accommodation.id)}
                      onFavoriteToggle={() => toggleFavorite(accommodation.id)}
                    />
                  ))
                : "No Accomodations listed"}
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="hover:text-blue-300">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-blue-300">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-blue-300">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p>Email: support@desidwaar.com</p>
                <p>Phone: +1 (123) 456-7890</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-blue-300">
                    Facebook
                  </a>
                  <a href="#" className="text-white hover:text-blue-300">
                    Twitter
                  </a>
                  <a href="#" className="text-white hover:text-blue-300">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </GoogleMapsLoader>
    </div>
  );
}
