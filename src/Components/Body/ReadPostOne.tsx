import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useParams, Link } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

interface Post {
  id: number;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  view: number;
  user: {
    profile: {
      nickname: string | null;
    } | null;
  };
  like: number;
}

interface Image {
  id: number;
  url: string;
  postId: number;
  createdAt: string; // or Date if needed
}

export default function ReadPostOne() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen">
        <EditorContent editor={editor} />
      </div>
      <div className="flex flex-row items-center text-3xl gap-2">
        <CiHeart className="text-5xl " />
        {post.like}
        <FaRegCommentAlt className=" mx-2 text-3xl" />
        10
      </div>
      <Link to={`/post/edit/${post.id}`}>
        <button>Edit</button>
      </Link>

      <button onClick={handleDeletePost}>Delete</button>

      <Link to="/">Back to List</Link>
    </div>
  );
}
