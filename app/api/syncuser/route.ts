import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"; // Import for Realtime Database
import { firestoredb, db } from "../../firebaseConfig"; // Update the path if needed
import { NextResponse } from "next/server";

export const POST = async(req:Request)=>  {

  const { user } = await req.json();

  if (!user || !user.id) {
    return NextResponse.json({ error: "User data is required" });
  }

  try {
    // Firestore Logic
    const userRef = doc(firestoredb, "users", user.id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      const userData = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        photoUrl: user.imageUrl,
        listings: [],
        wishlist: [],
      };

      await setDoc(userRef, userData);
      console.log("User added to Firestore:", user.id);

      // Realtime Database Logic
      const realtimeUserRef = ref(db, `users/${user.id}`);
      await set(realtimeUserRef, {
        ...userData,
        friends: {}, // Initialize an empty friends list if required
      });
      console.log("User added to Realtime Database:", user.id);
    }

    return NextResponse.json({ message: "User synced successfully" });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" });
  }
}
