import { useState } from "react";

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
  onCommentPosted: (newComment: Comment) => void;
}

export default function CommentForm({ postId, onCommentPosted }: Props) {
  // State for the comment input
  const [commentContent, setCommentContent] = useState("");
  // State for submission status (e.g., loading, error, success)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Allow string or null
  const [success, setSuccess] = useState<string | null>(null);

  // Word limit for the comment
  const maxChars = 200;

  // Handle comment input change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const charCount = value.length;

    if (charCount <= maxChars) {
      setCommentContent(value);
      setError(null); // Clear error if within limit
    } else {
      setError(`Comment exceeds ${maxChars} characters.`);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Replace with your API endpoint
      const response = await fetch(`${API_URL}/comment/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          content: commentContent,
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment.");
      }

      const result = await response.json();

      console.log(result);
      //const newComment = await response.json();
      setSuccess("Comment submitted successfully!");

      setCommentContent(""); // Clear textarea
      onCommentPosted(result.data); //Add new comment to the comment list.
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col my-4 w-full h-60 rounded-lg border border-gray-300 dark:border-gray-500 shadow-md bg-gray-200 dark:ink-bg-dark-100">
        <div className="px-4 pt-3 text-lg font-semibold text-gray-700 dark:text-gray-400">
          Leave a comment
        </div>
        <textarea
          placeholder="Write your comment here... Max 200 Characters"
          value={commentContent}
          onChange={handleCommentChange}
          className="flex-1 m-4 p-2 border-2 border-gray-300 dark:border-gray-500 rounded-md bg-gray-100 dark:ink-bg-dark-50 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent resize-none"
          disabled={isSubmitting}
        />
        <div className="px-4 pb-2 flex justify-end">
          <button
            onClick={handleSubmitComment}
            className={`px-4 py-1 basic-button transition-colors duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
}
