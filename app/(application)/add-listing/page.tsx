"use client";
import { useCallback, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Wifi,
  Tv,
  Utensils,
  Car,
  Trash2,
  ArrowLeft,
  Thermometer,
  Droplet,
  WashingMachine,
  Wind,
  BedDouble,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Autocomplete } from "@react-google-maps/api";
import GoogleMapsLoader from "../../components/GoogleMapsLoader";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary";
import Image from "next/image";

interface ListingData {
  title: string;
  address: string;
  city: string;
  zipCode: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  peopleLiving: number;
  availabilityStart: string;
  availabilityEnd: string;
  amenities: string[];
  rent: number;
  otherCharges: number;

  imageUrls: string[];
}

const amenitiesOptions = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "tv", label: "TV", icon: Tv },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Parking", icon: Car },
  { id: "heating", label: "Heating", icon: Thermometer },
  { id: "air-conditioning", label: "Air Conditioning", icon: Droplet },
  { id: "washer", label: "Washer", icon: WashingMachine },
  { id: "dryer", label: "Dryer", icon: Wind },
  { id: "essentials", label: "Essentials", icon: BedDouble },
  { id: "smoke-detector", label: "Smoke Detector", icon: ShieldCheck },
  { id: "other", label: "Other", icon: null },
];

export default function AddListing() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showOtherAmenityInput, setShowOtherAmenityInput] = useState(false);
  const [otherAmenity, setOtherAmenity] = useState("");

  const form = useForm<ListingData>({
    defaultValues: {
      title: "",
      address: "",
      city: "",
      zipCode: 0,
      description: "",
      bedrooms: 1,
      bathrooms: 1,
      peopleLiving: 1,
      availabilityStart: "",
      availabilityEnd: "",
      amenities: [],
      rent: 0,
      otherCharges: 0,
      imageUrls: [],
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ListingData> = async (data) => {
    // Prepare other amenities
    const otherAmenitiesArray = otherAmenity
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    // Add 'other' amenities to the amenities array and remove "other" if it exists
    data.amenities = [...data.amenities, ...otherAmenitiesArray].filter(
      (a) => a !== "other"
    );

    setOtherAmenity(""); // Clear the 'otherAmenity' field

    try {
      // Send a POST request to the backend route
      const response = await fetch("/api/addListing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the request was successful
      if (response.ok) {
        const result = await response.json();
        console.log("Listing added:", result.message);

        // Clear the form fields
        form.reset();

        // Redirect to the home page
        router.push("/home");
      } else {
        const errorData = await response.json();
        console.error("Failed to add listing:", errorData.error);
        alert("Failed to add listing: " + errorData.error);
      }
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("An error occurred while adding the listing.");
    }
  };

  const addressRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Function to set `addressRef` after Autocomplete loads
  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    addressRef.current = autocomplete;
  };

  // Function to handle place selection
  const handlePlaceSelect = useCallback(() => {
    const place = addressRef.current?.getPlace();
    if (!place?.address_components) return;

    let streetNumber = "";
    let route = "";
    const city =
      place.address_components.find((comp) => comp.types.includes("locality"))
        ?.long_name || "";
    const state =
      place.address_components.find((comp) =>
        comp.types.includes("administrative_area_level_1")
      )?.short_name || "";
    const country =
      place.address_components.find((comp) => comp.types.includes("country"))
        ?.long_name || "";
    const zipCode =
      place.address_components.find((comp) =>
        comp.types.includes("postal_code")
      )?.long_name || "";

    // Handle cases where address may be split into "street_number" and "route"
    place.address_components.forEach((component) => {
      if (component.types.includes("street_number")) {
        streetNumber = component.long_name;
      }
      if (component.types.includes("route")) {
        route = component.long_name;
      }
    });

    const fullAddress = `${streetNumber} ${route}`.trim();

    // Update form fields
    form.setValue("address", fullAddress); // Set only the street address
    form.setValue("city", `${city}, ${state}, ${country}`); // Set city, state, country
    form.setValue("zipCode", parseInt(zipCode) || 0); // Set zip code
  }, [form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const uploadedUrls = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file))
    );

    // Update the form with the new image URLs
    form.setValue("imageUrls", [
      ...form.getValues("imageUrls"),
      ...uploadedUrls,
    ]);
  };

  const removeImage = (index: number) => {
    const updatedImageUrls = form
      .getValues("imageUrls")
      .filter((_, i) => i !== index);
    form.setValue("imageUrls", updatedImageUrls);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return (
          form.watch("title") &&
          form.watch("address") &&
          form.watch("city") &&
          form.watch("zipCode") &&
          form.watch("description")
        );
      case 2:
        return (
          form.watch("bedrooms") &&
          form.watch("bathrooms") &&
          form.watch("peopleLiving") &&
          form.watch("availabilityStart") &&
          form.watch("availabilityEnd")
        );
      case 3:
        return form.watch("rent") && form.watch("otherCharges");
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <GoogleMapsLoader>
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="relative mb-8 flex justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/home")}
                className="absolute left-0 flex items-center"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center">
                Add Your Listing
              </h1>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="flex items-center">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= num
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {num}
                    </div>
                    {num < 3 && (
                      <div
                        className={`w-16 h-1 ${
                          step >= num + 1 ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {step === 1 && (
                  <>
                    <FormField
                      control={form.control}
                      name="title"
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Listing Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Cozy apartment in downtown"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Address is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Autocomplete
                              onPlaceChanged={handlePlaceSelect}
                              onLoad={handleLoad}
                            >
                              <Input placeholder="123 Main St" {...field} />
                            </Autocomplete>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        rules={{ required: "Zip Code is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your listing"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        rules={{ required: "Number of bedrooms is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        rules={{ required: "Number of bathrooms is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                step="0.5"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="peopleLiving"
                        rules={{
                          required: "Number of people living is required",
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>People Living</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="availabilityStart"
                        rules={{
                          required: "Availability start date is required",
                        }}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Availability Start</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="availabilityEnd"
                        rules={{
                          required: "Availability end date is required",
                        }}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Availability End</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) =>
                                    field.onChange(date?.toISOString())
                                  }
                                  disabled={(date) =>
                                    date < new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amenities"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">
                                Amenities
                              </FormLabel>
                              <FormDescription>
                                Select the amenities available in your listing.
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {amenitiesOptions.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="amenities"
                                  render={({ field }) => {
                                    const isChecked = field.value?.includes(
                                      item.id
                                    );
                                    return (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={isChecked}
                                            onCheckedChange={(checked) => {
                                              // Toggle 'Other' input visibility based on checkbox state
                                              if (item.id === "other") {
                                                setShowOtherAmenityInput(
                                                  checked === true
                                                );
                                              }
                                              // Update amenities array in the form
                                              const updatedAmenities = checked
                                                ? [...field.value, item.id]
                                                : field.value.filter(
                                                    (value) => value !== item.id
                                                  );
                                              field.onChange(updatedAmenities);
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.icon && (
                                            <item.icon className="w-4 h-4 inline-block mr-2" />
                                          )}
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {showOtherAmenityInput && (
                        <FormItem>
                          <FormLabel>Specify Other Amenities</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter other amenities, separated by commas"
                              value={otherAmenity}
                              onChange={(e) => setOtherAmenity(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rent"
                        rules={{ required: "Rent is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Rent</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="otherCharges"
                        rules={{ required: "Other charges are required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other Charges</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <div>
                        <FormLabel>Images</FormLabel>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload files</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={handleImageUpload}
                              />
                            </label>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>

                        {/* Image Preview Section */}
                        {form.watch("imageUrls")?.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            {form.watch("imageUrls").map((image, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={image}
                                  alt={`Uploaded ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-md"
                                  width={100}
                                  height={100}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  {step > 1 && (
                    <Button type="button" onClick={() => setStep(step - 1)}>
                      Previous
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={!isStepComplete(step)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={form.getValues("imageUrls").length < 2}
                    >
                      Submit Listing
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </GoogleMapsLoader>
    </div>
  );
}
