import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

// GET all community posts
export async function GET() {
  try {
    const postsRef = collection(db, "community_posts");
    const q = query(postsRef, orderBy("timestamp", "desc"));
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

// POST a new community post
export async function POST(request: Request) {
  const { title, content, tags } = await request.json();
  const user = await currentUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const postsRef = collection(db, "community_posts");
    const newPost = {
      title,
      content,
      tags,
      authorId: user.id,
      author: user.fullName,
      timestamp: new Date(),
      likes: [],
      comments: [],
    };
    const postDoc = await addDoc(postsRef, newPost);
    return NextResponse.json({ id: postDoc.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
