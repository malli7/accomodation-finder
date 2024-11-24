import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"; // Import for Realtime Database
import { firestoredb, db } from "../firebaseConfig"; // Ensure you import Realtime Database
import { currentUser } from "@clerk/nextjs/server";

export const SyncUserToFirestore = async () => {
  const user = await currentUser();
  const id = user?.id || "";
  if (!id) return;

  try {
    // Firestore Logic
    const userRef = doc(firestoredb, "users", id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists() && user) {
      const userData = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        createdAt: user.createdAt,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        photoUrl:user.imageUrl,
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
    console.error("Error adding user to Firestore or Realtime Database:", error);
  }
};
