import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import { formatDate } from "../../util/uitilFunc";
import CommentForm from "./Comment/CommentForm";

const API_URL = import.meta.env.VITE_API_URL;

interface Post {
  id: number;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  subCategory: {
    id: number;
    name: string;
  };
  view: number;
  user: {
    profile: {
      nickname: string | null;
    } | null;
  };
  likeCount: number;
}

interface Image {
  id: number;
  url: string;
  postId: number;
  createdAt: string; // or Date if needed
}

export default function ReadPostOne() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { id } = useParams();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: true })],
    content: "",
    editable: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const response = await fetch(`${API_URL}/post/read/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const res = await response.json();
        const fetchedPost = res.data;
        setLikeCount(fetchedPost.likeCount);
        setIsLiked(res.liked);

        console.log(fetchedPost);

        if (fetchedPost) {
          setPost(fetchedPost);
          editor?.commands.setContent(fetchedPost.content); // Set content here
        } else {
          setError("Post not found");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, [id, editor]);

  const handleLike = async () => {
    try {
      const response = await fetch(`${API_URL}/post/like/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const res = await response.json();
      console.log(res);

      // Update states based on the response
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to update like");
    }
  };

  const handleDeletePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!isConfirmed) return; // If the user cancels, do nothing

    try {
      const response = await fetch(`${API_URL}/post/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }

      alert("Post deleted successfully!");
      // Optionally, redirect or update UI
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  if (!editor) return null;
  if (loading) return <div>Loading post...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;
  return (
    <div>
      <h1>{post.title}</h1>
      <div> {formatDate(post.createdAt)}</div>
      <div>{post.user.profile?.nickname}</div>
      <div>{post.view}</div>
      <hr />
      <div className="min-h-screen">
        <EditorContent editor={editor} />
      </div>
      <div className="flex flex-row items-center text-2xl gap-6 justify-center">
        <div
          onClick={handleLike}
          className="flex flex-col items-center justify-between"
        >
          {isLiked ? (
            <FaHeart className="text-4xl text-red-500" />
          ) : (
            <FaRegHeart className="text-4xl text-red-500" />
          )}
          <div className="text-gray-700">{likeCount}</div>
        </div>
        <div className="flex flex-col h-full justify-between items-center">
          <FaRegCommentAlt className="text-gray-400 text-4xl" />
          <div className="text-gray-700">10</div>
        </div>
      </div>
      <Link to={`/post/edit/${post.id}`}>
        <button>Edit</button>
      </Link>

      <button onClick={handleDeletePost}>Delete</button>

      <div
        onClick={() =>
          navigate(`/post/list/${post.subCategory.id}?page=${page}`)
        }
      >
        Back to list
      </div>
      <CommentForm postId={post.id} />
    </div>
  );
}
