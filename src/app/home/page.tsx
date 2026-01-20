"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const handleAddBlog = () => {
    router.push("/add-blog");
  };

  const showBlogs = () => {
    router.push("/blogs");
  };

 
  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Welcome, {user.username}!</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Blog */}
          <button
            onClick={handleAddBlog}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-bold mb-2">Write a New Blog</h3>
            <p className="text-blue-100 opacity-90">Start crafting your next masterpiece</p>
          </button>

          {/* View Blogs */}
          <button
            onClick={showBlogs}
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-bold mb-2">View All Blogs</h3>
            <p className="text-green-100 opacity-90">Browse and manage your published blogs</p>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 dark:text-gray-400">
          © 2024 BlogSpace. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
