import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useCategory } from "../../../hooks/use-category";
import { useUser } from "../../../hooks/use-user";
import { formatDate } from "../../../util/uitilFunc";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import LoadingPage from "../../Error/LoadingPage";

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
  likeCount: number;
  commentCount: number;
}

export default function PostList() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const { categories } = useCategory();
  const [posts, setPosts] = useState<Post[]>([]);

  const [searchParams] = useSearchParams();

  const pageParam = searchParams.get("page");
  const pageParamNum = pageParam ? parseInt(pageParam) : 1;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParamNum);

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
  if (loading)
    return (
      <div className="flex justify-center pt-10 h-screen w-full">
        <LoadingPage />
      </div>
    );
  if (error) return <div>{error}</div>;

  const subCategory = categories
    .flatMap((cat) => cat.subCategories)
    .find((sub) => sub.id === Number(subCategoryId));

  // This should already be handled in useEffect, but kept for UI consistency
  if (!subCategory) return <div>Subcategory not found</div>;

  return (
    <div className="overflow-x-auto">
      <h1 className="m-2 ink-text-dark-100 dark:ink-text-dark-50 font-bold">
        {subCategory.name}
      </h1>
      <div className="flex justify-between m-3">
        <div className="flex items-center">Total Posts: {totalPosts}</div>
        <div
          className="flex items-center justify-center h-9 w-24 font-bold text-white basic-button"
          onClick={() => navigate(`/post/write/${subCategoryId}`)}
        >
          New Post
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg dark:shadow-gray-500 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-500"
            onClick={() => {
              if (user?.userId) {
                navigate(`/post/read/${post.id}?page=${currentPage}`);
              } else {
                navigate("/login");
              }
            }}
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {post.title}
            </h2>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex flex-wrap gap-2">
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                🧑 {post.user.profile?.nickname}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                📅 {formatDate(post.createdAt)}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                👁 {post.view}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                ❤️ {post.likeCount}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                💬 {post.commentCount}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center justify-center text-xl gap-2">
        <button
          className={`px-2 py-1 rounded-md text-xl ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
              : "text-blue-600 dark:bg-gray-700 hover:bg-[#e1f1fc]/50 cursor-pointer"
          } transition-colors duration-200`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </button>
        <span className="m-1 flex gap-3">
          <span>{currentPage}</span>
          <span>of</span>
          <span>{totalPages}</span>
        </span>
        <button
          className={`px-2 py-1 rounded-md text-xl  ${
            currentPage >= totalPages
              ? "bg-gray-100 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
              : " text-blue-600 dark:bg-gray-700 hover:bg-[#e1f1fc]/50 cursor-pointer"
          } transition-colors duration-200`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}
