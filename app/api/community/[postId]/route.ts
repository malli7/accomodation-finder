import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

// GET a single post by ID
export async function GET(
  request: Request) {
  const { pathname } = new URL(request.url);
  const postId = pathname.split("/").pop() || "";

  try {
    const postRef = doc(db, "community_posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(postDoc.data(), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// PATCH to update a post by ID (only if user is the creator)
export async function PATCH(
  request: Request) {
  const { pathname } = new URL(request.url);
  const postId = pathname.split("/").pop() || "";
  const { title, content, tags } = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const postRef = doc(db, "community_posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (postDoc.data()?.authorId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Only the author can edit this post" },
        { status: 403 }
      );
    }

    await updateDoc(postRef, { title, content, tags });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error}, { status: 500 });
  }
}

// DELETE a post by ID (only if user is the creator)
export async function DELETE(
  request: Request) {
  const { pathname } = new URL(request.url);
  const postId = pathname.split("/").pop() || "";  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const postRef = doc(db, "community_posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (postDoc.data()?.authorId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Only the author can delete this post" },
        { status: 403 }
      );
    }

    await deleteDoc(postRef);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// POST to like a post by ID
export async function POST(
  request: Request) {
  const { pathname } = new URL(request.url);
  const postId = pathname.split("/").pop() || "";  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const postRef = doc(db, "community_posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const currentLikes = postDoc.data()?.likes || [];

    // Check if user has already liked the post
    if (currentLikes.includes(user.id)) {
      await updateDoc(postRef, { likes: arrayRemove(user.id) });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Add user ID to likes array
    await updateDoc(postRef, { likes: arrayUnion(user.id) });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
