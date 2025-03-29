import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "../../hooks/use-category";

const API_URL = import.meta.env.VITE_API_URL;

interface Post {
  id: number;
  title: string;
  userid: string;
  view: number;
  createdAt: string;
  updatedAt: string;
  user: {
    profile: {
      nickname: string | null;
    } | null;
  };
  like: number;
}

export default function PostList() {
  const navigate = useNavigate();
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const { categories } = useCategory();
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    if (isToday) {
      // Show only hour (24-hour format)
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      // Show date (YYYY-MM-DD)
      return `${String(date.getFullYear()).slice(-2)}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // All hooks at the top
  useEffect(() => {
    const fetchData = async () => {
      if (!subCategoryId) {
        setError("No subcategory ID provided");
        setLoading(false);
        return;
      }

      const subCategoryIdNum = Number(subCategoryId);
      if (isNaN(subCategoryIdNum)) {
        setError("Invalid subcategory ID");
        setLoading(false);
        return;
      }

      const subCategory = categories
        .flatMap((cat) => cat.subCategories)
        .find((sub) => sub.id === subCategoryIdNum);

      if (!subCategory) {
        setError("Subcategory not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/post/list/${subCategoryId}?page=${currentPage}`,
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
        console.log(res);
        setPosts(res.posts || []);
        setTotalPosts(res.totalPosts);
        setTotalPages(Math.ceil(res.totalPosts / 15));
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subCategoryId, categories, currentPage]); // Include categories if it can change

  // Conditional rendering after hooks
  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  const subCategory = categories
    .flatMap((cat) => cat.subCategories)
    .find((sub) => sub.id === Number(subCategoryId));

  // This should already be handled in useEffect, but kept for UI consistency
  if (!subCategory) return <div>Subcategory not found</div>;

  return (
    <div className="overflow-x-auto">
      <h1 className="m-2 text-[#2b6cb0] ">{subCategory.name}</h1>
      <div className="flex justify-between m-3">
        <div className="flex items-center">total posts: {totalPosts}</div>
        <div
          className="flex items-center justify-center h-9 w-24 font-bold text-white basic-button"
          onClick={() => navigate(`/post/write/${subCategoryId}`)}
        >
          New Post
        </div>
      </div>

      <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-100 text-gray-700 uppercase text-sm tracking-wider">
            <th className="w-[9%] py-3 px-4 text-center">ID</th>
            <th className="w-[55%] py-3 px-4 text-left">Title</th>
            <th className="w-[9%] py-3 px-4 text-center">Writer</th>
            <th className="w-[9%] py-3 px-4 text-center">Date</th>
            <th className="w-[9%] py-3 px-4 text-center">View</th>
            <th className="w-[9%] py-3 px-4 text-center">Likes</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b bg-gray-100 border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => navigate(`/post/read/${post.id}`)}
            >
              <td className="w-[9%] py-4 px-4 text-gray-800 text-center">
                {post.id}
              </td>
              <td className="w-[55%] py-4 px-4 text-gray-800">{post.title}</td>
              <td className="w-[9%] py-4 px-4 text-gray-600 text-center">
                {post.user.profile?.nickname}
              </td>
              <td className="w-[9%] py-4 px-4 text-gray-600 text-center">
                {formatDate(post.createdAt)}
              </td>
              <td className="w-[9%] py-4 px-4 text-gray-600 text-center">
                {post.view}
              </td>
              <td className="w-[9%] py-4 px-4 text-center">{post.like}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          className="m-1"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="m-1">
          {currentPage} of {totalPages}
        </span>
        <button
          className="m-1"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
