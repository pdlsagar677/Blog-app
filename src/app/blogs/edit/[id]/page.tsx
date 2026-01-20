// app/edit-blog/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchBlog();
  }, [user, authLoading, router]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        setError("No session token found");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/blogs/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.blog) {
        // Check if user is the author
        if (data.blog.authorId !== user?.id) {
          setError("You are not authorized to edit this blog");
          router.push("/blogs");
          return;
        }
        setBlog(data.blog);
        setTitle(data.blog.title);
        setContent(data.blog.content);
      } else {
        setError(data.error || "Failed to fetch blog");
        router.push("/blogs");
      }
    } catch {
      setError("Network error while fetching blog");
      router.push("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        setError("No session token found");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/blogs");
      } else {
        setError(data.error || "Failed to update blog");
      }
    } catch {
      setError("Network error while updating blog");
    } finally {
      setSaving(false);
    }
  };

 
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Blog</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Update your blog post below
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white resize-none"
                placeholder="Write your blog content here..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/blogs")}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Update Blog"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}