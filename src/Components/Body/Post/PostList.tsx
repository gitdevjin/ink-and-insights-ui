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
import { FaRegCommentAlt } from "react-icons/fa";

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
      <h1 className="m-2 text-[#2b6cb0] font-bold">{subCategory.name}</h1>
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
            <th className="w-[8%] py-3 px-4 text-center">ID</th>
            <th className="w-[55%] py-3 px-4 text-left">Title</th>
            <th className="w-[8%] py-3 px-4 text-center">Writer</th>
            <th className="w-[8%] py-3 px-4 text-center">Date</th>
            <th className="w-[7%] py-3 px-4 text-center">Views</th>
            <th className="w-[6%] py-3 px-4 text-center">Likes</th>
            <th className="w-[4%] py-3 px-4 text-center">
              <FaRegCommentAlt className="flex justify-center items-center m-auto" />
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="border-b bg-gray-100 border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={() => {
                if (user?.userId) {
                  navigate(`/post/read/${post.id}?page=${currentPage}`);
                } else {
                  navigate("/login");
                }
              }}
            >
              <td className="w-[8%] py-4 px-4 text-gray-800 text-center">
                {post.id}
              </td>
              <td className="w-[55%] py-4 px-4 text-gray-800">{post.title}</td>
              <td className="w-[8%] py-4 px-4 text-gray-600 text-center">
                {post.user.profile?.nickname}
              </td>
              <td className="w-[8%] py-4 px-4 text-gray-600 text-center">
                {formatDate(post.createdAt)}
              </td>
              <td className="w-[7%] py-4 px-4 text-gray-600 text-center">
                {post.view}
              </td>
              <td className="w-[6%] py-4 px-4 text-center">{post.likeCount}</td>
              <td className="w-[4%] py-4 px-4 text-center">
                {post.commentCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-row items-center justify-center text-xl gap-2">
        <button
          className="m-1 text-blue-600 text-2xl cursor-pointer hover:bg-[#e1f1fc]/50"
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
          className="m-1 text-blue-600 text-2xl cursor-pointer hover:bg-[#e1f1fc]/50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}
