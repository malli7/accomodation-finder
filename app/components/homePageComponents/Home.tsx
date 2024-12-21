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
                <a href="#" className="text-white hover:text-blue-300">
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
                <a href="#" className="text-white hover:text-blue-300">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-300">
                  <XIcon />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Acco-Finder. All rights
              reserved.
            </p>
          </div>
        </footer>
      </GoogleMapsLoader>
    </div>
  );
}
