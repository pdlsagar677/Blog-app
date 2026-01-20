import { create } from "zustand";

export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  addBlog: (blog: Omit<Blog, "id" | "createdAt">) => Promise<Blog | null>;
  setBlogs: (blogs: Blog[]) => void;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  loading: false,
  error: null,

  setBlogs: (blogs) => set({ blogs }),

  addBlog: async (blog) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set({ blogs: [...get().blogs, data.blog], loading: false });
        return data.blog;
      } else {
        set({ error: data.error || "Failed to add blog", loading: false });
        return null;
      }
    } catch (err) {
      set({ error: "Network error", loading: false });
      return null;
    }
  },
}));
