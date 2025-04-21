import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentPagination from "./CommentPagination";

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
  createdAt: string;
  updatedAt: string;
}
interface Props {
  postId: number;
  isCommentsOpen: boolean;
  totalComments: number;
  setTotalComments: React.Dispatch<React.SetStateAction<number>>;
}

export default function Comment({
  postId,
  isCommentsOpen,
  totalComments,
  setTotalComments,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 10;

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

  const fetchComments = async () => {
    console.log("fetch start");
    try {
      const res = await fetch(
        `${API_URL}/comment/list/${postId}?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();
      console.log("data recieved from server");
      setComments(data.comments || []);
      console.log(data.comments);
      setTotalComments(data.totalComments || 0);
      setTotalPages(Math.ceil(data.totalComments / commentsPerPage));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, currentPage]);

  const handleCommentPosted = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev].slice(0, commentsPerPage));
    setTotalComments((prev) => prev + 1);
    setTotalPages(Math.ceil((totalComments + 1) / commentsPerPage));
  };

  const handleEditComment = (commentId: number) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
    setEditingCommentId(null);
    // fetchComments(); looks like this is not necessary
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    setTotalComments((prev) => prev - 1);
  };

  return (
    <div className="my-4">
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isCommentsOpen ? "max-h-[1100px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CommentList
          postId={postId}
          comments={comments}
          editingCommentId={editingCommentId}
          onEditComment={handleEditComment}
          onCancelEdit={handleCancelEdit}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />
      </div>

      {totalComments > 0 && (
        <CommentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextCommentPage}
          onPrevious={handlePreviousCommentPage}
        />
      )}
      <CommentForm postId={postId} onCommentPosted={handleCommentPosted} />
    </div>
  );
}
