import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/use-user";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

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
  subCategory: {
    name: string;
  };
}

export default function ActivityLikedPosts() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 15;

  const handleNextPostPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    console.log("Current Page is " + currentPage);
  };

  const handlePreviousPostPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    console.log("Current Page is " + currentPage);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/activity/likedPost?page=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const res = await response.json();
        console.log(res);
        setLikedPosts(res.likedPosts || []);
        setTotalPosts(res.totalLikedPosts);
        setTotalPages(Math.ceil(res.totalLikedPosts / postsPerPage));
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [currentPage]);

  return (
    <div>
      <div>
        {user?.name}'s Total Liked Posts: {totalPosts}
      </div>
      {likedPosts.length !== 0 &&
        likedPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 mb-4 border dark:border-gray-800 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/post/read/${post.id}`)}
          >
            <div className="flex items-center gap-4 justify-items-start mb-2">
              <span className="text-sm text-gray-500">#{post.id}</span>
              <span className="font-semibold text-lg dark:text-gray-200">
                {post.title}{" "}
                <span className="text-blue-500">[{post.commentCount}]</span>
              </span>
            </div>
            <div className="flex flex-wrap text-sm text-gray-600 dark:text-gray-300 mb-2 gap-4">
              <span>{post.user.profile?.nickname}</span>
              <span className="text-gray-500">|</span>
              <span>{post.subCategory.name}</span>
              <span className="text-gray-500">|</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-400">
              <span>👁 {post.view}</span>
              <span>❤️ {post.likeCount}</span>
            </div>
          </div>
        ))}
      <div></div>
      {/* Pagenation */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={handlePreviousPostPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-md text-xl ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
              : "text-blue-600 dark:bg-gray-700 hover:bg-[#e1f1fc]/50 cursor-pointer"
          } transition-colors duration-200`}
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </button>
        <div className="text-gray-600 dark:text-gray-300 flex flex-row gap-2 justify-center items-center">
          <span>{currentPage}</span> <span>of</span> <span>{totalPages}</span>
        </div>
        <button
          onClick={handleNextPostPage}
          disabled={currentPage >= totalPages}
          className={`px-2 py-1 rounded-md text-xl  ${
            currentPage >= totalPages
              ? "bg-gray-100 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
              : " text-blue-600 dark:bg-gray-700 hover:bg-[#e1f1fc]/50 cursor-pointer"
          } transition-colors duration-200`}
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}
