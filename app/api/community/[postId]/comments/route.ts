import { NextResponse } from "next/server";
import { firestoredb as db } from "@/app/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { currentUser } from "@clerk/nextjs/server";

// POST to add a comment to a post
export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
   const a = pathname.split("/").filter((a) => a!== pathname.split("/").pop())
  const postId = a.pop() || "";
  const { content } = await request.json();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    const postRef = doc(db, "community_posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create a new comment
    const newComment = {
      id: `${postId}-${Date.now()}`, // Unique ID for the comment
      content,
      authorId: user.id,
      author: user.fullName,
      timestamp: new Date(),
    };

    // Add the comment to the "comments" array of the post
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });

    return NextResponse.json(
      { success: true, comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
