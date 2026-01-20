// lib/store/useBlogStore.ts
import { create } from "zustand";

export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addBlog: (blog: Omit<Blog, "id" | "createdAt">) => Promise<Blog | null>;
  updateBlog: (id: string, blog: { title: string; content: string }) => Promise<Blog | null>;
  deleteBlog: (id: string) => Promise<boolean>;
  fetchUserBlogs: () => Promise<void>;
  setBlogs: (blogs: Blog[]) => void;
  clearError: () => void;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  loading: false,
  error: null,

  setBlogs: (blogs) => set({ blogs }),

  clearError: () => set({ error: null }),

  fetchUserBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        set({ error: "No session token", loading: false });
        return;
      }

      const res = await fetch("/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        set({ blogs: data.blogs, loading: false });
      } else {
        set({ error: data.error || "Failed to fetch blogs", loading: false });
      }
    } catch {
      set({ error: "Network error", loading: false });
    }
  },

  addBlog: async (blogData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        set({ error: "No session token", loading: false });
        return null;
      }

      const res = await fetch("/api/add-blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });
      
      const data = await res.json();
      if (data.success && data.blog) {
        const newBlog: Blog = data.blog;
        set((state) => ({
          blogs: [newBlog, ...state.blogs],
          loading: false,
        }));
        return newBlog;
      } else {
        set({ error: data.error || "Failed to add blog", loading: false });
        return null;
      }
    } catch {
      set({ error: "Network error", loading: false });
      return null;
    }
  },

  updateBlog: async (id, blogData) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        set({ error: "No session token", loading: false });
        return null;
      }

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogData),
      });
      
      const data = await res.json();
      if (data.success && data.blog) {
        const updatedBlog: Blog = data.blog;
        set((state) => ({
          blogs: state.blogs.map(blog => 
            blog.id === id ? updatedBlog : blog
          ),
          loading: false,
        }));
        return updatedBlog;
      } else {
        set({ error: data.error || "Failed to update blog", loading: false });
        return null;
      }
    } catch {
      set({ error: "Network error", loading: false });
      return null;
    }
  },

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        set({ error: "No session token", loading: false });
        return false;
      }

      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          blogs: state.blogs.filter(blog => blog.id !== id),
          loading: false,
        }));
        return true;
      } else {
        set({ error: data.error || "Failed to delete blog", loading: false });
        return false;
      }
    } catch {
      set({ error: "Network error", loading: false });
      return false;
    }
  },
}));