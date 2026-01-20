"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBlogStore } from "../../lib/store/useBlogStore";

export default function AddPostPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addBlog, loading: blogLoading, error: blogError } = useBlogStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!title || !content) {
      setMessage("All fields are required");
      return;
    }
    if (!user) {
      setMessage("You must be logged in to add a blog");
      return;
    }

    const newBlog = await addBlog({
      title,
      content,
      authorId: user.id,
    });

    if (newBlog) {
      setMessage("Blog added successfully!");
      setTitle("");
      setContent("");
      setTimeout(() => router.push("/home"), 1000);
    } else {
      setMessage(blogError || "Failed to add blog");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">You must be logged in to add a blog</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Add New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="Blog title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="Write your blog content..."
              rows={6}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={blogLoading}
            className={`w-full py-3 rounded-lg font-medium text-white ${
              blogLoading ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {blogLoading ? "Adding..." : "Add Blog"}
          </button>

          {/* Message */}
          {message && (
            <p
              className={`text-center mt-2 ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
