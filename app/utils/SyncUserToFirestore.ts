"use client";
import { useUser } from "@clerk/nextjs";


export const SyncUserToFirestore = () => {
  const { user } = useUser();
  if (!user) {
    console.error("No user found");
    return;
  }

  const userData = {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    createdAt: user.createdAt,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };

  fetch("/api/syncuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: userData }),
  })
    .then((response) =>
      response.json().then((data) => {
        if (!response.ok) {
          throw new Error(data.error || "Failed to sync user");
        }
        console.log("User synced successfully:", data.message);
      })
    )
    .catch((error) => {
      console.error("Error syncing user to backend:", error);
    });
};
