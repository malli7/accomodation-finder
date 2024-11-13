import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

// GET only posts by the current user
export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const postsRef = collection(db, "community_posts");
    const q = query(postsRef, where("authorId", "==", user.id));
    const postsSnapshot = await getDocs(q);
    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
