import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"; // Import for Realtime Database
import { firestoredb, db } from "../firebaseConfig"; // Ensure you import Realtime Database
import { currentUser } from "@clerk/nextjs/server";

export const SyncUserToFirestore = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      console.log("User is not available yet. Retrying...");
      return; // Exit early if the user is not ready
    }

    const id = user.id;

    // Firestore Logic
    const userRef = doc(firestoredb, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        createdAt: user.createdAt,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        photoUrl: user.imageUrl,
        listings: [],
        wishlist: [],
      };

      await setDoc(userRef, userData);
      console.log("User added to Firestore:", user.id);

      // Realtime Database Logic
      const realtimeUserRef = ref(db, `users/${id}`);
      await set(realtimeUserRef, {
        ...userData,
        friends: {}, // Initialize an empty friends list if required
      });
      console.log("User added to Realtime Database:", user.id);
    }
  } catch (error) {
    console.error("Error syncing user to Firestore or Realtime Database:", error);
  }
};
