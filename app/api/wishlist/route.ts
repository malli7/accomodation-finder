import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

//route to toggle wishlist a listing
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { listingId } = await request.json();
  const userRef = doc(db, "users", user.id);

  // Get the current user's wishlist
  const userSnapshot = await getDoc(userRef);
  if (!userSnapshot.exists()) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userData = userSnapshot.data();
  const wishlist = userData.wishlist || [];

  // Check if listingId is already in the wishlist
  const isFavorited = wishlist.includes(listingId);

  // Update the wishlist accordingly
  await updateDoc(userRef, {
    wishlist: isFavorited ? arrayRemove(listingId) : arrayUnion(listingId),
  });

  const message = isFavorited
    ? "Listing removed from wishlist"
    : "Listing added to wishlist";

  return NextResponse.json({ message });
}

//get all the wishlisted listings of current user
export async function GET() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRef = doc(db, "users", user.id);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    return NextResponse.json({ wishlist: [] });
  }

  const userData = userSnapshot.data();
  return NextResponse.json({ wishlist: userData.wishlist || [] });
}
