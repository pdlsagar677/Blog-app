"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleAddBlog = () => {
    router.push("/add-blog"); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        Welcome {user?.username || "Guest"}!
      </h1>

      <button
        onClick={handleAddBlog}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        + Add Blog
      </button>

      <div className="mt-8 w-full max-w-3xl">
        <p className="text-gray-500 text-center">Your blogs will appear here...</p>
      </div>
    </div>
  );
}
