import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

//route to get all the listings of current user
export async function GET() {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const listingsRef = collection(db, "listings");
  const q = query(listingsRef, where("userId", "==", user.id));
  const listingsSnapshot = await getDocs(q);
  const listings = listingsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(listings);
}
