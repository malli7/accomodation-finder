import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

//route to edit listings of current user
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const listingId = url.pathname.split("/").pop() || "";
  const listingRef = doc(db, "listings", listingId);
  const listingSnap = await getDoc(listingRef);

  if (!listingSnap.exists() || listingSnap.data().userId !== user.id) {
    return NextResponse.json(
      { error: "Listing not found or unauthorized" },
      { status: 403 }
    );
  }

  const updatedData = await req.json();
  await updateDoc(listingRef, updatedData);

  return NextResponse.json({ message: "Listing updated successfully" });
}
//route to delete listings of current user
export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const listingId = url.pathname.split("/").pop();

  if (!listingId) {
    return NextResponse.json({ error: "Missing listingId" }, { status: 400 });
  }

  try {
    const listingRef = doc(db, "listings", listingId);
    const listingSnap = await getDoc(listingRef);

    if (!listingSnap.exists()) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    await deleteDoc(listingRef);
    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
