"use client";
import { useState, useEffect } from "react";
import {
  Heart,
  Bed,
  Bath,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Utensils,
  Wifi,
  Car,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AccommodationCardProps {
  id: string;
  title: string;
  address: string;
  city: string;
  zipCode: number;
  description: string;
  bedrooms: string | number;
  bathrooms: string | number;
  peopleLiving: string | number;
  availabilityStart: string;
  availabilityEnd: string;
  amenities: string[];
  rent: string | number;
  otherCharges: string | number;
  imageUrls: string[];
  userId: string;
  isFavorite: boolean;
  onFavoriteToggle: () => Promise<void>;
}

const amenityIcons: { [key: string]: JSX.Element } = {
  wifi: <Wifi className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  kitchen: <Utensils className="w-4 h-4" />,
};

function FullScreenImageViewer({
  images,
  onClose,
}: {
  images: string[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            fill
            src={images[currentIndex]}
            alt={`Full screen view ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white hover:bg-white/20"
          onClick={prevImage}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:bg-white/20"
          onClick={nextImage}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AccommodationCard({
  title,
  address,
  city,
  zipCode,
  description,
  bedrooms,
  bathrooms,
  peopleLiving,
  availabilityStart,
  availabilityEnd,
  amenities,
  rent,
  otherCharges,
  imageUrls,
  isFavorite,
  userId,
  onFavoriteToggle,
}: AccommodationCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const router = useRouter();
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, ${city}, ${zipCode}`
  )}`;

  const nextImage = () => {
    if (imageUrls && imageUrls.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }
  };

  const prevImage = () => {
    if (imageUrls && imageUrls.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + imageUrls.length) % imageUrls.length
      );
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
        <div className="relative h-64">
          {imageUrls && imageUrls.length > 0 ? (
            <>
              <Image
                fill
                src={imageUrls[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowFullScreen(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {imageUrls.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="bg-black/50 text-white rounded-full hover:bg-black/60"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="bg-black/50 text-white rounded-full hover:bg-black/60"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full z-10 hover:bg-white/90"
            onClick={onFavoriteToggle}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "text-red-500 fill-current" : "text-gray-600"
              }`}
            />
          </Button>
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {address}, {city}, {zipCode}
                  </a>
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ${typeof rent === "number" ? rent.toFixed(2) : rent}
              </p>
              <p className="text-sm text-gray-600">per month</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Bed className="w-5 h-5 mr-2" />
              <span>{bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath className="w-5 h-5 mr-2" />
              <span>{bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-2" />
              <span>{peopleLiving} People</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                Available: {new Date(availabilityStart).toLocaleDateString()}
              </span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-6">{description}</p>
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-800">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenities && amenities.length > 0 ? (
                amenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="bg-primary/10 text-primary flex items-center gap-1"
                  >
                    {amenityIcons[amenity.toLowerCase()] || null}
                    {amenity}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-600">No amenities listed</p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Additional charges: ${otherCharges}
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Available until</p>
            <p className="text-sm text-gray-600">
              {new Date(availabilityEnd).toLocaleDateString()}
            </p>
          </div>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push(`/chat?friendId=${userId}`)}
          >
            Contact Host
          </Button>
        </CardFooter>
      </Card>
      {showFullScreen && (
        <FullScreenImageViewer
          images={imageUrls}
          onClose={() => setShowFullScreen(false)}
        />
      )}
    </>
  );
}
