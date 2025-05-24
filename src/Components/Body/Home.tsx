import { useUser } from "../../hooks/use-user";
import { useCategory } from "../../hooks/use-category";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface Post {
  id: number;
  title: string;
  userId: string;
  view: number;
  createdAt: string;
  updatedAt: string;
  user: {
    profile: {
      nickname: string | null;
    } | null;
  };
  likeCount: number;
  commentCount: number;
  subCategory: {
    name: string;
  };
}

export default function Home() {
  const { user } = useUser();
  const { categories } = useCategory();
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/home/post/tops?postNum=8&standard=view`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const res = await response.json();
        console.log(res.posts);
        setPosts(res.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-2 dark:text-gray-200">
        Welcome, {user ? user.name : "Guest"} 👋
      </h1>

      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        A space for sparking and sharing your ideas and insights.
      </p>

      <div className="mb-6">
        <section className="py-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            🔥 Top Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post: Post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-500 p-4 rounded-lg shadow hover:shadow-md dark:hover:shadow-gray-400 transition cursor-pointer"
                onClick={() => navigate(`/post/read/${post.id}`)}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {post.title}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  by {post.user?.profile?.nickname ?? "Anonymous"} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                  <span>👁️ {post.view}</span>
                  <span>👍 {post.likeCount}</span>
                  <span>💬 {post.commentCount}</span>
                  <span>{post.subCategory.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="py-8">
        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
          📎 Browse Categories
        </h2>
        <div className="flex flex-wrap gap-4">
          {categories.flatMap((category) =>
            category.subCategories.map((sub) => (
              <span
                onClick={() => navigate(`/post/list/${sub.id}`)}
                key={sub.id}
                className="bg-blue-100 text-blue-800 dark:ink-bg-button-100 dark:text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:opacity-80 transition"
              >
                {sub.name}
              </span>
            ))
          )}
        </div>
      </section>
      <div className="h-[calc(10vh)]" />
      <section className="text-center py-10 bg-blue-50 dark:ink-bg-dark-100 rounded-lg mt-12">
        <h2 className="text-2xl font-bold mb-2 dark:text-gray-200">
          Ready to share your thoughts?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Start your first post and contribute to the community!
        </p>
        <button className="ink-bg-button-50 text-white px-6 py-2 rounded hover:ink-bg-button-100 transition cursor-pointer">
          Create Post
        </button>
      </section>
      <div className="h-[calc(10vh)]" />
      <section className="py-12 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2 dark:text-gray-300">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          We aim to build a community where ideas are exchanged freely and
          creators thrive through collaboration.
        </p>
      </section>
    </div>
  );
}
