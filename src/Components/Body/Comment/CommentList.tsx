import { useState } from "react";
import { useUser } from "../../../hooks/use-user";

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

interface CommentListProps {
  postId: number;
  comments: Comment[];
  editingCommentId: number | null;
  onEditComment: (commentId: number) => void;
  onCancelEdit: () => void;
  onCommentUpdated: (updatedComment: Comment) => void;
  onCommentDeleted: (commentId: number) => void;
}

export default function CommentList({
  postId,
  comments,
  editingCommentId,
  onEditComment,
  onCancelEdit,
  onCommentUpdated,
  onCommentDeleted,
}: CommentListProps) {
  const { user } = useUser();
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const maxChars = 200;

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const charCount = value.length;

    if (charCount <= maxChars) {
      setEditContent(value);
      setEditError(null);
    } else {
      setEditError(`Comment exceeds ${maxChars} Characters.`);
    }
  };

  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) {
      setEditError("Comment cannot be empty.");
      return;
    }

    setIsUpdating(true);
    setEditError(null);

    try {
      const response = await fetch(`${API_URL}/comment/edit/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) throw new Error("Failed to update comment");

      const data = await response.json();
      onCommentUpdated(data.comment);
      setEditContent("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setEditError(err.message);
      } else {
        setEditError("An unknown error occurred.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!isConfirmed) return; // If the user cancels, do nothing

    try {
      const response = await fetch(`${API_URL}/comment/delete/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          postId,
        }),
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      const data = await response.json();
      console.log(data.data);
      console.log(data.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setEditError(err.message);
      } else {
        setEditError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="mt-6">
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={`${comment.id}-${comment.createdAt}`}
            className="mb-2 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-800">
                  {comment.user?.profile?.nickname || "Anonymous"}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-row gap-2">
                {user?.userId === comment.user?.id && (
                  <button
                    onClick={() => {
                      setEditContent(comment.content);
                      onEditComment(comment.id);
                    }}
                    className="bg-[#0d9488]/75 hover:bg-[#0c5d56] rounded-sm w-8 text-white text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                )}
                {user?.userId === comment.user?.id && (
                  <button
                    onClick={(e) => {
                      handleDelete(e, comment.id);
                      onCommentDeleted(comment.id);
                    }}
                    className="bg-[#E53E3E]/75 text-white w-12 rounded-sm hover:bg-[#C53030] text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            {editingCommentId === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={handleEditChange}
                  placeholder="Edit your comment..."
                  className="w-full p-2 border-2 border-gray-300 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none h-20"
                  disabled={isUpdating}
                />
                {editError && (
                  <p className="text-red-500 text-sm mt-1">{editError}</p>
                )}
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={onCancelEdit}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(comment.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      isUpdating
                        ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-700">{comment.content}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
