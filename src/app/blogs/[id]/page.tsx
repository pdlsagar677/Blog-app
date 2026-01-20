// app/blogs/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Blog } from "@/lib/store/useBlogStore";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);

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
      setError("");
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        setError("No session token found");
        setLoading(false);
        return;
      }

      const blogId = Array.isArray(params.id) ? params.id[0] : params.id;
      
      const res = await fetch(`/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.blog) {
        setBlog(data.blog);
        setIsAuthor(data.blog.authorId === user?.id);
      } else {
        setError(data.error || "Failed to fetch blog");
        if (res.status === 404) {
          setTimeout(() => router.push("/blogs"), 2000);
        }
      }
    } catch (err) {
      setError("Network error while fetching blog");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (blog) {
      router.push(`/blogs/edit/${blog.id}`);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    
    if (!confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        setError("No session token found");
        return;
      }

      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        router.push("/blogs");
      } else {
        setError(data.error || "Failed to delete blog");
      }
    } catch {
      setError("Network error while deleting blog");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading states
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
       
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
     
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
                {error.includes("not found") && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">Redirecting to blogs page...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blog Content */}
        {blog && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Blog Header */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {blog.title}
                  </h1>
                  
               
                </div>

                {/* Action Buttons (if author) */}
                {isAuthor && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={handleEdit}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete blog"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Tags/Categories (optional) */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  Blog Post
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  Published
                </span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {/* Content with proper formatting */}
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {blog.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

  
      </main>

    
    </div>
  );
}