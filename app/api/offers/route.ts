import { firestoredb as db } from "@/app/firebaseConfig";
import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Enum for predefined main categories
enum OfferCategory {
  FEATURED_BANNER = "featuredBanner",
  FEATURED_OFFERS = "featuredOffers",
  ADDITIONAL_OFFERS = "additionalOffers",
}

// Define the structure of the offer data
interface OfferData {
  id?: string;
  title: string;
  description: string;
  category: OfferCategory; // Main category
  subCategory?: string; // Optional subcategory (e.g., tech, food, etc.)
  discount?: string;
  image: string;
  badge?: { text: string; color: string };
  icon?: string;
}

// GET Route - Fetch categorized offers
export async function GET() {
  try {
    // Fetch all offers from the Firestore collection
    const offersSnapshot = await getDocs(collection(db, "offers"));
    const offers = offersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as OfferData[];

    // Categorize the offers
    const featuredBanner = offers.find(
      (offer) => offer.category === OfferCategory.FEATURED_BANNER
    );
    const featuredOffers = offers.filter(
      (offer) => offer.category === OfferCategory.FEATURED_OFFERS
    );
    const additionalOffers = offers.filter(
      (offer) => offer.category === OfferCategory.ADDITIONAL_OFFERS
    );

    // Return the data in the required format
    return NextResponse.json({
      featuredBanner,
      featuredOffers,
      additionalOffers,
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

// POST Route - Add a new offer or banner
export async function POST(request: Request) {
  try {
    const offerData: OfferData = await request.json();

    // Validate the main category
    if (!Object.values(OfferCategory).includes(offerData.category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Add the offer/banner to Firestore
    const offerRef = await addDoc(collection(db, "offers"), {
      ...offerData,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({
      id: offerRef.id,
      message: "Offer successfully added!",
    });
  } catch (error) {
    console.error("Error adding offer:", error);
    return NextResponse.json({ error: "Failed to add offer" }, { status: 500 });
  }
}

// PATCH Route - Update an existing offer or banner
export async function PATCH(request: Request) {
  try {
    const { id, ...updatedData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Offer ID is required" },
        { status: 400 }
      );
    }

    // Validate category if it's being updated
    if (
      updatedData.category &&
      !Object.values(OfferCategory).includes(updatedData.category)
    ) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const offerRef = doc(db, "offers", id);
    await updateDoc(offerRef, { ...updatedData });

    return NextResponse.json({ message: "Offer successfully updated!" });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}

// DELETE Route - Delete an offer or banner
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Offer ID is required" },
        { status: 400 }
      );
    }

    const offerRef = doc(db, "offers", id);
    await deleteDoc(offerRef);

    return NextResponse.json({ message: "Offer successfully deleted!" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json(
      { error: "Failed to delete offer" },
      { status: 500 }
    );
  }
}
