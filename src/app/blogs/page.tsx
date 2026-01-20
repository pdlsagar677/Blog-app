// app/blogs/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBlogStore } from "@/lib/store/useBlogStore";

export default function BlogsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    blogs, 
    loading: blogsLoading, 
    error, 
    fetchUserBlogs, 
    deleteBlog,
    clearError 
  } = useBlogStore();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchUserBlogs();
  }, [user, authLoading, router]);

  const handleEdit = (blogId: string) => {
    router.push(`/blogs/edit/${blogId}`);
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    await deleteBlog(blogId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading || blogsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Your Blog Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {blogs.length} {blogs.length === 1 ? 'blog' : 'blogs'} published
              </p>
            </div>
            <button
              onClick={() => router.push("/add-blog")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + New Blog
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex justify-between items-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Empty State */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start writing your first blog post
            </p>
            <button
              onClick={() => router.push("/add-blog")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Your First Blog
            </button>
          </div>
        ) : (
          /* Blogs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{blogs.map((blog) => (
  <div
    key={blog.id}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
  >
    {/* Blog Header */}
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
        {blog.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {formatDate(blog.createdAt)}
      </p>
     
    </div>

    {/* Blog Content Preview */}
    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
      {blog.content}
    </p>

    {/* Action Buttons */}
    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={() => router.push(`/blogs/${blog.id}`)}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
      >
        Read More
      </button>
      
      {/* Only show edit/delete buttons if user is the author */}
      {blog.authorId === user?.id && (
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/blogs/edit/${blog.id}`)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => handleDelete(blog.id)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
}