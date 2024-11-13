"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { db as database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useUser } from "@clerk/nextjs";

interface UnseenMessageContextType {
  unseenCount: number;
  setUnseenCount: (count: number) => void;
}
interface Msg  {
  receiverId: string;
  seen: boolean;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

const UnseenMessageContext = createContext<UnseenMessageContextType>({
  unseenCount: 0,
  setUnseenCount: () => {},
});

export const useUnseenMessage = () => useContext(UnseenMessageContext);

export const UnseenMessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const friendsRef = ref(database, `users/${user.id}/friends`);
    const unsubscribe = onValue(friendsRef, async (snapshot) => {
      const friendsData = snapshot.val();
      const friendsList = friendsData ? Object.keys(friendsData) : [];

      let count = 0;

      // Loop through each friend and check for unseen messages
      await Promise.all(
        friendsList.map(async (friendId) => {
          const chatId = [user.id, friendId].sort().join("_");
          const messagesRef = ref(database, `chats/${chatId}/messages`);

          await new Promise<void>((resolve) => {
            onValue(messagesRef, (msgSnapshot) => {
              const messages:Msg[] = msgSnapshot.val();
              if (messages) {
                const unseenMessages = Object.values(messages).some(
                  (msg:Msg) => msg.receiverId === user.id && !msg.seen
                );
                if (unseenMessages) count += 1;
              }
              resolve();
            });
          });
        })
      );

      setUnseenCount(count);
    });

    return () => unsubscribe();
  }, [user?.id]);

  return (
    <UnseenMessageContext.Provider value={{ unseenCount, setUnseenCount }}>
      {children}
    </UnseenMessageContext.Provider>
  );
};
