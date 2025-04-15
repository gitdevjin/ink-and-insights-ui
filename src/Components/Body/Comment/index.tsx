import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import CommentPagination from "./CommentPagination";

const API_URL = import.meta.env.VITE_API_URL;

interface Comment {
  id: number;
  content: string;
  user: {
    profile: {
      nickname: string | null;
    } | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface Props {
  postId: number;
}

export default function Comment({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const [totalComments, setTotalComments] = useState(0);
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
    // fetchComments();
  };

  return (
    <div className="my-4">
      <CommentList
        comments={comments}
        editingCommentId={editingCommentId}
        onEditComment={handleEditComment}
        onCancelEdit={handleCancelEdit}
        onCommentUpdated={handleCommentUpdated}
      />
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
