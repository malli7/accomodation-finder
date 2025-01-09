"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Filter, ChevronDown, XIcon } from "lucide-react";
import LocationPopup from "./LocationPopup";
import AccommodationCard from "./AccommodationCard";
import GoogleMapsLoader from "../GoogleMapsLoader";
import NavBar from "./NavBar";
import Filters from "./Filters";
import { useUser } from "@clerk/nextjs";

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

  const { user } = useUser();

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
          const filteredData = data.filter(
            (listing) => listing.userId !== user?.id // Assuming currentUser is available
          );
          setFilteredAccommodations(filteredData);
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

        <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Explore Acco-Finder</h3>
              <nav>
                <ul className="space-y-2">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/about", label: "About" },
                    { href: "/privacy", label: "Privacy" },
                    { href: "/terms", label: "Terms" },
                    { href: "/contact", label: "Contact" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <p className="text-gray-300">Email: accofinder0@gmail.com</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/Acco-Finderr/61571678853106/"
                className="text-white hover:text-blue-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/accofinder0/"
                className="text-white hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://x.com/accofinder0"
                className="text-white hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/acco-finder/"
                className="text-white hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 Acco-Finder. All rights reserved.</p>
        </div>
      </footer>
      </GoogleMapsLoader>
    </div>
  );
}
