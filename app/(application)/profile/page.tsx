"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Plus,
  MapPin,
  Bed,
  Bath,
  Users,
  Calendar,
  DollarSign,
  Camera,
  Mail,
  X,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import NavBar from "@/app/components/homePageComponents/NavBar";

interface Listing {
  id: string;
  title: string;
  address: string;
  city: string;
  zipCode: string;
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
}

// Cloudinary upload function
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append(
    "cloud_name",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
  );
  formData.append("transformation", "fl_progressive,f_webp,q_auto");

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return response.data.secure_url;
};

function EditListingPopup({
  listing,
  onClose,
  onSave,
}: {
  listing: Listing;
  onClose: () => void;
  onSave: (updatedListing: Listing) => void;
}) {
  const [editedListing, setEditedListing] = useState<Listing>(listing);
  const [newAmenity, setNewAmenity] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImageToCloudinary(file);
      setEditedListing((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, url],
      }));
    }
  };

  const handleSave = async () => {
    try {
      const listingId = listing.id;
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedListing,
          availabilityStart: editedListing.availabilityStart,
          availabilityEnd: editedListing.availabilityEnd,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      onSave(editedListing);
      onClose();
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setEditedListing((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setEditedListing((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== amenity),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Listing</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={editedListing.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={editedListing.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={editedListing.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={editedListing.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={editedListing.zipCode}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="availabilityStart">Availability Start</Label>
            <Input
              id="availabilityStart"
              name="availabilityStart"
              type="date"
              value={editedListing.availabilityStart}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="availabilityEnd">Availability End</Label>
            <Input
              id="availabilityEnd"
              name="availabilityEnd"
              type="date"
              value={editedListing.availabilityEnd}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label>Images</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {editedListing.imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Listing Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-1 right-1 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      setEditedListing((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="amenities">Amenities</Label>
            <div className="flex items-center space-x-2 mb-2">
              <Input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add new amenity"
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleAddAmenity}>
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedListing.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                >
                  <span>{amenity}</span>
                  <button
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function EnhancedProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch listings");
      }

      const listings = await response.json();
      setListings(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      setListings(listings.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
  };

  const handleSaveListing = (updatedListing: Listing) => {
    setListings(
      listings.map((listing) =>
        listing.id === updatedListing.id ? updatedListing : listing
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <NavBar />
      <div className="relative h-80 md:h-96 overflow-hidden">
        <Image
          src={
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          }
          alt="Luxurious beachfront property with palm trees and a beautiful sunset"
          fill
          className="brightness-75 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="md:flex items-center p-6 md:p-8">
            <div className="md:flex-shrink-0 mb-4 md:mb-0 md:mr-8">
              <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full ring-4 ring-white mx-auto md:mx-0">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || ""} />
                <AvatarFallback>
                  {user?.fullName ? user.fullName.charAt(0) : ""}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {user?.fullName || ""}
              </h2>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <Mail className="h-5 w-5 mr-2" />
                <span>{user?.emailAddresses[0].emailAddress}</span>
              </div>
              <Button
                onClick={() => {}}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Edit className="mr-2 h-4 w-4" />
                <UserButton showName />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Listings</h2>
            <Button
              onClick={() => router.push("/add-listing")}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              <Plus className="mr-2 h-5 w-5" /> Add New Listing
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <div className="relative">
                      <Image
                        src={listing.imageUrls[0]}
                        alt={listing.title}
                        width={800}
                        height={600}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-2">
                        <Camera className="h-5 w-5 text-gray-500" />
                        <span className="sr-only">Number of photos</span>
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {listing.imageUrls.length}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center mb-4">
                        <MapPin className="mr-1 h-4 w-4" /> {listing.city},{" "}
                        {listing.zipCode}
                      </p>
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Bed className="mr-1 h-4 w-4" /> {listing.bedrooms}{" "}
                          bed
                        </span>
                        <span className="flex items-center">
                          <Bath className="mr-1 h-4 w-4" /> {listing.bathrooms}{" "}
                          bath
                        </span>
                        <span className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />{" "}
                          {listing.peopleLiving} max
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-indigo-600 flex items-center">
                          <DollarSign className="h-6 w-6" />
                          {listing.rent}
                          <span className="text-sm font-normal text-gray-500">
                            /mo
                          </span>
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(
                            listing.availabilityStart
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            listing.availabilityEnd
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditListing(listing)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {editingListing && (
        <EditListingPopup
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSave={handleSaveListing}
        />
      )}
    </div>
  );
}
