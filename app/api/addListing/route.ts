import { firestoredb as db } from "@/app/firebaseConfig";
// app/api/addListing/route.ts
import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

// Define the structure of the listing data
interface ListingData {
  title: string;
  address: string;
  city: string;
  zipCode: string;
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

//ROUTE TO ADD A LISTING
export async function POST(request: Request) {
  try {
    const listingData: ListingData = await request.json();
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    // Add the listing to the 'listings' collection
    const listingRef = await addDoc(collection(db, "listings"), {
      ...listingData,
      userId,
      timestamp: serverTimestamp(),
    });

    // Update the user's 'listings' field with the new listing ID
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      listings: arrayUnion(listingRef.id),
    });

    return NextResponse.json({
      id: listingRef.id,
      message: "Listing successfully added!",
    });
  } catch (error) {
    console.error("Error adding listing:", error);
    return NextResponse.json({ error });
  }
}
