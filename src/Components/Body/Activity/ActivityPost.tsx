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
}

export default function ActivityPost() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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
        const response = fetch(`${API_URL}/activity/post?page=${currentPage}`);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      Post Activity
      {/* Pagenation */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={handlePreviousPostPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-md text-xl ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "text-[#2b6cb0] hover:bg-[#e1f1fc]/50 cursor-pointer"
          } transition-colors duration-200`}
        >
          <MdOutlineKeyboardDoubleArrowLeft />
        </button>
        <div className="text-gray-600 flex flex-row gap-2 justify-center items-center">
          <span>{currentPage}</span> <span>of</span> <span>{totalPages}</span>
        </div>
        <button
          onClick={handleNextPostPage}
          disabled={currentPage >= totalPages}
          className={`px-2 py-1 rounded-md text-xl ${
            currentPage >= totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "text-[#2b6cb0] hover:bg-[#e1f1fc]/50 cursor-pointer"
          } transition-colors duration-200`}
        >
          <MdOutlineKeyboardDoubleArrowRight />
        </button>
      </div>
    </div>
  );
}
