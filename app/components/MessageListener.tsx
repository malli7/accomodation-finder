"use client";
import { useEffect } from "react";
import { ref, onChildAdded } from "firebase/database";
import { db as database } from "../firebaseConfig";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { User } from "lucide-react";

export default function MessageListener() {
  const { user } = useUser();
  const router = useRouter();
  const url = usePathname()

  // Initialize notified messages from sessionStorage
  const notifiedMessages = new Set(
    JSON.parse(sessionStorage.getItem("notifiedMessages") || "[]")
  );

  useEffect(() => {
    if (!user?.id) return;

    const friendsRef = ref(database, `users/${user.id}/friends`);

    const friendsListener = onChildAdded(friendsRef, (snapshot) => {
      const friendId = snapshot.key;
      if (friendId) {
        const chatId = [user.id, friendId].sort().join("_");
        const messagesRef = ref(database, `chats/${chatId}/messages`);

        onChildAdded(messagesRef, (msgSnapshot) => {
          const message = msgSnapshot.val();
          const messageId = msgSnapshot.key;

          // Show the toast only if this message hasn't been notified
          if (message && message.receiverId === user.id && !message.seen && !notifiedMessages.has(messageId) && (!url.startsWith("/chat"))) {
            // Add message ID to notified set and sessionStorage
            notifiedMessages.add(messageId);
            sessionStorage.setItem("notifiedMessages", JSON.stringify(Array.from(notifiedMessages)));

            // Display the toast
            toast(
              <div
                className="flex items-center space-x-3 p-2"
                onClick={() => router.push(`/chat?friendId=${friendId}`)}
                style={{ cursor: "pointer" }}
              >
                {message.photoUrl ? (
                  <img
                    src={message.photoUrl}
                    alt={message.senderName}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={24} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: "1rem" }}>{message.senderName}</strong>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#555" }}>{message.text}</p>
                </div>
              </div>,
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        });
      }
    });

    return () => {
      friendsListener();
    };
  }, [user?.id, router]);

  return null;
}
