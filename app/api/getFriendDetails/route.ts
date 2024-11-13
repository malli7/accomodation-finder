import { db } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import { NextResponse } from "next/server";

type Friend = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
};



export const POST = async (req: Request) => {
  const { friendIds } = await req.json();
  if (!friendIds || !Array.isArray(friendIds)) {
    return NextResponse.json({
      error: "Invalid request: friendIds must be provided as an array",
    });
  }

  try {
    const friends: Friend[] = [];

    // Loop through each friendId and fetch the friend data from Firebase
    for (const friendId of friendIds) {
      console.log("friend:", friendId);
      const friendRef = ref(db, `users/${friendId}`);
      const snapshot = await get(friendRef);

      if (snapshot.exists()) {
        const friendData = snapshot.val();
        console.log("f", friendData);
        friends.push({
          id: friendId,
          name: friendData.name,
          email: friendData.email,
          photoUrl:friendData.photoUrl
        });
      }
    }

    return NextResponse.json({ friends });
  } catch (error) {
    return NextResponse.json({ error});
  }
};
