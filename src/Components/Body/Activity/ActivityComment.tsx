import { useUser } from "../../../hooks/use-user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

interface Comment {
  id: number;
  content: string;
  user: {
    id: string;
    profile: {
      nickname: string | null;
    } | null;
  };
  post: {
    id: number;
    title: string;
    commentCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ActivityComment() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 15;

  const handleNextCommentPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    console.log("Current Page is " + currentPage);
  };

  const handlePreviousCommentPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    console.log("Current Page is " + currentPage);
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/activity/comment?page=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setComments(data.comments);
        setTotalComments(data.totalComments);
        setTotalPages(Math.ceil(data.totalComments / commentsPerPage));
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [user?.userId, currentPage]);

  return (
    <div>
      <div>
        {user?.name}'s Total Comments: {totalComments}
      </div>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={`${comment.id}-${comment.createdAt}`}
            className="mb-2 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <div
              onClick={() => navigate(`/post/read/${comment.post.id}`)}
              className="flex justify-between items-center cursor-pointer"
            >
              <div className="flex flex-col">
                <div>
                  <span className="font-semibold text-gray-800">
                    {comment.user.profile?.nickname}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="p-1">{comment.content}</div>
                <div className="text-gray-400">
                  Post Title: {comment.post.title}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagenation */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={handlePreviousCommentPage}
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
          onClick={handleNextCommentPage}
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
