"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Send,
  Edit,
  Trash,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";
import NavBar from "@/app/components/homePageComponents/NavBar";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
}

interface InitialComment {
  id: string;
  author: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
}
interface InitialPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: { seconds: number; nanoseconds: number };
  tags: string[];
  likes: string[];
  comments: InitialComment[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export default function RefinedCommunityBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [showAddPost, setShowAddPost] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const { userId } = useAuth();
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const openEditPopup = (post: Post) => {
    setEditingPost(post);
    setIsEditPopupOpen(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    const response = await fetch("/api/community");
    const data = await response.json();

    const formattedData = data
      .map((post: InitialPost) => ({
        ...post,
        timestamp: post.timestamp?.seconds
          ? formatDistanceToNow(new Date(post.timestamp.seconds * 1000), {
              addSuffix: true,
            })
          : "",
        comments: post.comments
          .map((comment: InitialComment) => ({
            ...comment,
            timestamp: comment.timestamp?.seconds
              ? formatDistanceToNow(
                  new Date(comment.timestamp.seconds * 1000),
                  {
                    addSuffix: true,
                  }
                )
              : "",
          }))
          .sort((a: Comment, b: Comment) => {
            // Sort comments by timestamp, newest first
            const aTimestamp = new Date(a.timestamp).getTime();
            const bTimestamp = new Date(b.timestamp).getTime();
            return bTimestamp - aTimestamp;
          }), // Sort comments by timestamp, newest first
      }))
      .sort((a: Comment, b: Comment) => {
        // Sort comments by timestamp, newest first
        const aTimestamp = new Date(a.timestamp).getTime();
        const bTimestamp = new Date(b.timestamp).getTime();
        return bTimestamp - aTimestamp;
      });
    setPosts(formattedData);
    setFilteredPosts(formattedData);
  };

  const handleAddPost = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        tags: newTags.split(",").map((tag) => tag.trim()),
      }),
    });
    if (response.ok) {
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      fetchPosts();
      setShowAddPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const response = await fetch(`/api/community/${postId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    }
  };

  const handleEditPost = async (
    postId: string,
    updatedTitle: string,
    updatedContent: string,
    updatedTags: string[]
  ) => {
    const response = await fetch(`/api/community/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: updatedTitle,
        content: updatedContent,
        tags: updatedTags,
      }),
    });
    if (response.ok) {
      fetchPosts();
    }
  };

  const handleLikePost = async (postId: string) => {
    const response = await fetch(`/api/community/${postId}`, {
      method: "POST",
    });
    if (response.ok) {
      fetchPosts();
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  const handleAddComment = async (postId: string) => {
    if (newComment.trim() === "") return;

    const response = await fetch(`/api/community/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment,
        author: user?.fullName || "Anonymous",
      }),
    });

    if (response.ok) {
      setNewComment("");
      fetchPosts();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <NavBar />
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-5 z-0"></div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white shadow-sm z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h1 className="text-4xl font-bold text-stone-800 tracking-tight">
                Community Board
              </h1>
              <p className="text-lg text-stone-600 font-medium">
                Connect, Ask, and Offer Help
              </p>
            </div>
            <div className="flex space-x-4 items-center">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="max-w-xs border-stone-300 focus:border-stone-500"
              />
              <Button
                onClick={() => setShowAddPost(!showAddPost)}
                variant="ghost"
                className="rounded-full hover:bg-stone-100 transition-colors duration-200"
              >
                {showAddPost ? <Minus /> : <Plus />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {showAddPost && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-stone-200">
                <CardTitle className="text-2xl text-stone-800">
                  Create a Post
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddPost} className="space-y-4">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Title"
                    className="border-stone-300 focus:border-stone-500"
                  />
                  <Textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="border-stone-300 focus:border-stone-500"
                  />
                  <Input
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="border-stone-300 focus:border-stone-500"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-stone-800 hover:bg-stone-900 text-white transition-colors duration-200"
                  >
                    <Send className="mr-2 h-4 w-4" /> Post
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="border-b border-stone-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-stone-800">
                        {post.title}
                      </CardTitle>
                      <p className="text-sm text-stone-500">{post.timestamp}</p>
                    </div>
                    <Avatar className="border-2 border-stone-200">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.author}`}
                      />
                      <AvatarFallback>
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-stone-700">{post.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-stone-200 text-stone-700 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-stone-200 pt-4">
                  <div className="flex space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikePost(post.id)}
                      className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                    >
                      {user &&
                      Array.isArray(post.likes) &&
                      post.likes.includes(user?.id) ? (
                        <Heart
                          strokeWidth={0}
                          className="mr-2 h-4 w-4 fill-red-500"
                        />
                      ) : (
                        <Heart className="mr-2 h-4 w-4" />
                      )}

                      {post.likes.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />{" "}
                      {post.comments.length}
                    </Button>
                  </div>
                  {userId === post.authorId && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditPopup(post)}
                        className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  )}
                </CardFooter>
                <AnimatePresence>
                  {expandedComments === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="mt-4 border-t border-stone-200 pt-4"
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.author}`}
                              />
                              <AvatarFallback>
                                {comment.author.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold  text-stone-700">
                                {comment.author}
                              </p>
                              <p className="text-sm text-stone-600">
                                {comment.content}
                              </p>
                              <p className="text-xs text-stone-500 mt-1">
                                {comment.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 flex items-center space-x-2">
                        <Input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-grow border-stone-300 focus:border-stone-500"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddComment(post.id)}
                          className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      {isEditPopupOpen && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-stone-800">
                Edit Post
              </h2>
              <Button variant="ghost" onClick={() => setIsEditPopupOpen(false)}>
                <Minus className="h-5 w-5 text-stone-600" />
              </Button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditPost(
                  editingPost.id,
                  editingPost.title,
                  editingPost.content,
                  editingPost.tags
                );
                setIsEditPopupOpen(false);
              }}
              className="space-y-4"
            >
              <Input
                value={editingPost.title}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, title: e.target.value })
                }
                placeholder="Title"
                className="w-full border-stone-300 focus:border-stone-500"
              />
              <Textarea
                value={editingPost.content}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, content: e.target.value })
                }
                placeholder="What's on your mind?"
                className="w-full border-stone-300 focus:border-stone-500"
              />
              <Input
                value={editingPost.tags.join(", ")}
                onChange={(e) =>
                  setEditingPost({
                    ...editingPost,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  })
                }
                placeholder="Tags (comma-separated)"
                className="w-full border-stone-300 focus:border-stone-500"
              />
              <Button
                type="submit"
                className="w-full bg-stone-800 hover:bg-stone-900 text-white transition-colors duration-200"
              >
                <Send className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
