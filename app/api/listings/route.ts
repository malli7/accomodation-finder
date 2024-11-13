import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

//get listings based on the city selected
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  const listingsRef = collection(db, "listings");
  let q;
  if (city) {
    q = query(listingsRef, where("city", "==", city));
  } else {
    return NextResponse.json(
      { error: "City must be provided" },
      { status: 400 }
    );
  }

  const listingsSnapshot = await getDocs(q);
  const listings = listingsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json(listings);
}
