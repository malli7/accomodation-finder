"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db as database } from "../../firebaseConfig";
import { ref, push, onValue, get, set, remove } from "firebase/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {  useUser } from "@clerk/nextjs";
import { Send, ArrowLeft, MoreVertical, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUnseenMessage } from "../UnseenMessageContext"; 
type Friend = {
  id: string;
  name: string;
  email?: string;
  photoUrl: string;
  lastMessage?: string;
  unseenMessages?: boolean;
};

type Message = {
  receiverId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  seen: boolean;
  id: string;
};

export default function ChatPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFriendId = searchParams.get("friendId");
  const { setUnseenCount } = useUnseenMessage(); // Destructure setUnseenCount from the context



  const [friends, setFriends] = useState<Friend[]>([]);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unseenFriendsCount = friends.filter(
    (friend) => friend.unseenMessages
  ).length;

  const generateChatId = (userId: string, receiverId: string) => {
    return [userId, receiverId].sort().join("_");
  };

  const addFriendIfNotExists = async (userId: string, friendId: string) => {
    const userFriendRef = ref(database, `users/${userId}/friends/${friendId}`);
    const friendSnapshot = await get(userFriendRef);
    if (!friendSnapshot.exists()) {
      await set(userFriendRef, true);
      await set(ref(database, `users/${friendId}/friends/${userId}`), true);
    }
  };

  const loadMessages = (chatId: string) => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = data
        ? Object.entries(data).map(([id, messageData]) => ({
            id,
            ...(messageData as Omit<Message, "id">),
          }))
        : [];
      setMessages(messageList);

      messageList
        .filter((msg) => msg.receiverId === user?.id && !msg.seen)
        .forEach((msg) =>
          set(ref(database, `chats/${chatId}/messages/${msg.id}/seen`), true)
        );
    });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    await push(messagesRef, {
      text: newMessage,
      senderId: user?.id,
      senderName: user?.fullName,
      receiverId: friend?.id,
      timestamp: Date.now(),
      seen: false,
    });

    setNewMessage("");

    await addFriendIfNotExists(user?.id || "", friend?.id || "");
  };

  const deleteMessage = async (id: string) => {
    const messageRef = ref(database, `chats/${chatId}/messages/${id}`);
    await remove(messageRef);
    setMessages(messages.filter((message) => message.id !== id));
  };

  const selectFriend = async (selectedFriend: Friend) => {
    setFriend(selectedFriend);
    const newChatId = generateChatId(user?.id || "", selectedFriend.id);
    setChatId(newChatId);

    // Update unseen status in friends list
    setFriends((prevFriends) =>
      prevFriends.map((f) =>
        f.id === selectedFriend.id ? { ...f, unseenMessages: false } : f
      )
    );

    // Load messages and mark unseen messages as seen
    loadMessages(newChatId);
  };

  const loadFriends = async () => {
    const friendsRef = ref(database, `users/${user?.id}/friends`);
    onValue(friendsRef, async (snapshot) => {
      const data = snapshot.val();
      const friendsList = data ? Object.keys(data) : [];

      const friendsData = await Promise.all(
        friendsList.map(async (friendId) => {
          const chatId = generateChatId(user?.id || "", friendId);
          const messagesRef = ref(database, `chats/${chatId}/messages`);
          const snapshot = await get(messagesRef);
          const messages = snapshot.val();
          const lastMessage = messages
            ? (Object.values(messages).pop() as Message)
            : null;
          return {
            id: friendId,
            name: lastMessage?.senderName || "Friend",
            photoUrl: "",
            lastMessage: lastMessage?.text || "No messages yet",
            unseenMessages:
              lastMessage?.receiverId === user?.id && !lastMessage?.seen,
          };
        })
      );
      setFriends(friendsData as Friend[]);
    });
  };

  useEffect(() => {
    loadFriends();
  }, [user?.id]);

  useEffect(() => {
   setUnseenCount(unseenFriendsCount); 
  }, [unseenFriendsCount]);

  

  useEffect(() => {
    if (selectedFriendId) {
      const fetchFriendDetails = async () => {
        const res = await fetch("/api/getFriendDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendIds: [selectedFriendId] }),
        });
        const result = await res.json();
        if (res.ok && result.friends.length > 0) {
          selectFriend(result.friends[0]);
        }
      };
      fetchFriendDetails();
    }
  }, [selectedFriendId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100 flex-col sm:flex-row">
      <aside className="w-full sm:w-1/4 bg-white border-r">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            Chat {unseenFriendsCount > 0 && `(${unseenFriendsCount} new)`}
          </h1>
          <Button
            onClick={() => router.push("/home")}
            className="bg-white text-black hover:text-white"
          >
            <Building2 /> Home
          </Button>
        </div>
        <div className="p-4">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <ScrollArea className="sm:h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                onClick={() => selectFriend(friend)}
              >
                <Avatar>
                  <AvatarImage src={friend.photoUrl} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm truncate ${
                      friend.unseenMessages
                        ? "font-bold text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {friend.name}
                  </p>
                  <p
                    className={`text-sm truncate ${
                      friend.unseenMessages ? "font-bold" : "text-gray-500"
                    }`}
                  >
                    {friend.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 p-2 rounded-sm bg-[#0B141A]">
        {friend ? (
          <>
            <header className="bg-card rounded-lg shadow-sm p-4 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={friend.photoUrl} alt={friend.name} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="ml-3 text-xl font-semibold">{friend.name}</h1>
            </header>

            <div className="flex flex-col h-[90%] mx-auto bg-[#0B141A] text-white">
              <div className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`relative group flex ${
                        msg.senderId === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderId === user?.id
                            ? "bg-[#005C4B]"
                            : "bg-[#1F2C34]"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.text}</p>
                        <p className="text-[10px] text-gray-400 text-right mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {msg.senderId === user?.id &&
                          index === messages.length - 1 &&
                          msg.seen && (
                            <div className="text-xs text-gray-500 mt-1">
                              Seen
                            </div>
                          )}
                      </div>
                      {msg.senderId === user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="absolute opacity-0 group-hover:opacity-100">
                              <MoreVertical className="right-2 my-2 top-2 h-4 w-4 text-gray-500" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => deleteMessage(msg.id)}
                            >
                              Delete Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <footer className="bg-[#343f46] p-3 border-t border-gray-700">
                <form
                  onSubmit={sendMessage}
                  className="flex items-center space-x-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow bg-[#2A3942] border-none text-white placeholder-gray-400"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-[#00A884] hover:bg-[#00A884]/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </footer>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-400">
              Select a friend to start chatting
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
