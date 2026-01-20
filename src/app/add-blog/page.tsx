"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBlogStore } from "@/lib/store/useBlogStore";

export default function AddPostPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addBlog, loading: blogLoading, error: blogError, clearError } = useBlogStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Calculate word and character count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(content.length);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    clearError();

    // Validation
    if (!title.trim()) {
      setMessage("Title is required");
      return;
    }

    if (!content.trim()) {
      setMessage("Content is required");
      return;
    }

    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length < 100) {
      setMessage(`Content must be at least 100 words. Currently: ${words.length} words`);
      return;
    }

    if (title.length > 200) {
      setMessage("Title must be less than 200 characters");
      return;
    }

    if (content.length > 1000000) {
      setMessage("Content must be less than 10,000 characters");
      return;
    }

    if (!user) {
      setMessage("You must be logged in to add a blog");
      return;
    }

    const newBlog = await addBlog({
      title: title.trim(),
      content: content.trim(),
      authorId: user.id,
    });

    if (newBlog) {
      setMessage("Blog added successfully!");
      setTitle("");
      setContent("");
      setTimeout(() => router.push("/blogs"), 1500);
    } else {
      setMessage(blogError || "Failed to add blog");
    }
  };


  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400 text-lg">You must be logged in to add a blog</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/blogs")}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blogs
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Create New Blog Post</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your thoughts, ideas, and stories with the world. Minimum 100 words required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Enter a compelling title for your blog..."
                maxLength={200}
                required
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {title.length}/200 characters
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Content <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(Minimum 100 words)</span>
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className={`font-medium ${wordCount >= 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {wordCount} words
                  </span>
                  <span className="mx-2">•</span>
                  <span>{characterCount} characters</span>
                  <span className="mx-2">•</span>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
                placeholder="Start writing your amazing blog content here..."
                required
              />
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                {characterCount}
              </div>
            </div>



            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/blogs")}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                disabled={blogLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={blogLoading || wordCount < 100}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  blogLoading || wordCount < 100
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {blogLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publishing...
                  </>
                ) : wordCount < 100 ? (
                  'Need 100 Words'
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Blog
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {(message || blogError) && (
              <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                <p className={`font-medium ${message.includes('success') ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {message || blogError}
                </p>
                {message.includes('success') && (
                  <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                    Redirecting to blogs page...
                  </p>
                )}
              </div>
            )}
          </form>

         
        </div>
      </div>
    </div>
  );
}