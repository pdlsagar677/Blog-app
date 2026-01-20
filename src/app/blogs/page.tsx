"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Blog } from "@/lib/store/useBlogStore";

export default function BlogsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait until auth is fully initialized
    if (authLoading) return;

    // Only redirect if auth is NOT loading and user is null
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        // Get token from auth store instead of localStorage
        const token = localStorage.getItem("sessionToken");
        if (!token) {
          setError("No session token found");
          setBlogsLoading(false);
          return;
        }

        const res = await fetch("/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.blogs) {
          setBlogs(data.blogs);
        } else {
          setError(data.error || "Failed to fetch blogs");
        }
      } catch {
        setError("Network error while fetching blogs");
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, [user, authLoading, router]);

  // Show loading while auth is initializing
  if (authLoading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  // Show redirect message only after auth is loaded and user is null
  if (!user) {
    return <p className="text-center mt-10 text-gray-600">Redirecting to login...</p>;
  }

  if (blogsLoading) {
    return <p className="text-center mt-10 text-gray-600">Loading blogs...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Blogs</h1>

        {blogs.length === 0 && (
          <p className="text-gray-600">You have not added any blogs yet.</p>
        )}

        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
              <p className="text-gray-700">{blog.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                Created at: {new Date(blog.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}