import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"; // Import for Realtime Database
import { firestoredb, db } from "../firebaseConfig"; // Ensure you import Realtime Database
import { currentUser } from "@clerk/nextjs/server";

export const SyncUserToFirestore = async () => {
  try {
    // Poll for the user until it's retrieved
    const waitForUser = async () => {
      let user = await currentUser();
      console.log(user)
      let attempts = 0;

      // Retry until user is fetched or a maximum number of attempts is reached
      while (!user && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
        user = await currentUser();
        attempts++;
      }

      if (!user) {
        throw new Error("Failed to retrieve user details after multiple attempts");
      }
      return user;
    };

    const user = await waitForUser(); // Wait until user details are retrieved
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
