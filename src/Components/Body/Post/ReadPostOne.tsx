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
import { FaHeart, FaRegHeart, FaRegCommentAlt, FaEye } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
//import { formatDate } from "../../util/uitilFunc";
import Comment from "../Comment";
import { useUser } from "../../../hooks/use-user";
import LoadingPage from "../../Error/LoadingPage";

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
  commentCount: number;
}

interface Image {
  id: number;
  url: string;
  postId: number;
  createdAt: string; // or Date if needed
}

export default function ReadPostOne() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { id } = useParams();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [totalComments, setTotalComments] = useState(0);

  const [isCommentsOpen, setIsCommentsOpen] = useState(true);

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
          credentials: "include",
        });

        const res = await response.json();
        const fetchedPost = res.data;
        setLikeCount(fetchedPost.likeCount);
        setIsLiked(res.liked);
        setTotalComments(fetchedPost.commentCount);

        console.log(fetchedPost);
        console.log(res.liked);

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

      const data = await response.json();
      alert("Post deleted successfully!");
      navigate(`/post/list/${data.post.subCategoryId}`);
      // Optionally, redirect or update UI
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  if (!editor) return null;
  if (loading)
    return (
      <div className="flex justify-center pt-10 h-screen w-full">
        <LoadingPage />
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;
  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col ">
          <div className="text-6xl">{post.title}</div>
        </div>
        <div>
          <div className="flex justify-end text-gray-600">
            {new Date(post.createdAt).toLocaleString()}
          </div>
          <div className="flex justify-end text-2xl items-center gap-2">
            <MdAccountCircle className="text-gray-400" />
            {post.user.profile?.nickname}
          </div>
          <div className="flex justify-end text-lg">
            <div className="flex flex-row gap-4">
              <div className="flex flex-row items-center gap-1">
                <FaEye className="text-gray-500" /> {post.view}
              </div>
              <div className="flex flex-row items-center gap-1">
                <FaRegHeart className="text-gray-500" /> {post.likeCount}
              </div>
              <div className="flex flex-row items-center gap-1">
                <FaRegCommentAlt className="text-gray-500" />{" "}
                {post.commentCount}
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="text-blue-800" />
      {post.userId === user?.userId && (
        <div className="mt-2 flex flex-row gap-2 justify-end">
          <Link
            className="text-blue-600 hover:text-blue-800 text-md"
            to={`/post/edit/${post.id}`}
          >
            <button className="bg-[#0d9488] hover:bg-[#0c5d56] text-white px-1 w-12 rounded-sm cursor-pointer">
              Edit
            </button>
          </Link>

          <button
            className="bg-[#E53E3E] text-white px-1 w-14 rounded-sm hover:bg-[#C53030] cursor-pointer"
            onClick={handleDeletePost}
          >
            Delete
          </button>
        </div>
      )}

      <div className="min-h-screen">
        <EditorContent editor={editor} />
      </div>
      <div className="flex flex-row items-center text-2xl gap-6 justify-center">
        <div
          onClick={handleLike}
          className="flex flex-col items-center justify-between cursor-pointer"
        >
          {isLiked ? (
            <FaHeart className="text-4xl text-red-500" />
          ) : (
            <FaRegHeart className="text-4xl text-red-500" />
          )}
          <div className="text-gray-700">{likeCount}</div>
        </div>
        <div
          onClick={() => setIsCommentsOpen((prev) => !prev)}
          className="flex flex-col h-full justify-between items-center cursor-pointer"
        >
          <FaRegCommentAlt className="text-gray-400 text-4xl " />
          <div className="text-gray-700">{totalComments}</div>
        </div>
      </div>

      <div
        onClick={() =>
          navigate(`/post/list/${post.subCategory.id}?page=${page}`)
        }
        className="flex items-center justify-center w-32 h-8 px-4 py-2 my-4 mx-auto text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
        aria-label="Back to post list"
      >
        Back to list
      </div>
      <Comment
        postId={post.id}
        isCommentsOpen={isCommentsOpen}
        totalComments={totalComments}
        setTotalComments={setTotalComments}
      />
    </div>
  );
}
