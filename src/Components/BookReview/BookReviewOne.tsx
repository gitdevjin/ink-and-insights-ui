import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useParams, Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
}

interface Image {
  id: number;
  url: string;
  postId: number;
  createdAt: string; // or Date if needed
}

export default function BookReviewOne() {
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
        const response = await fetch(`http://localhost:8080/post/read/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const res = await response.json();
        const fetchedPost = res.data;

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
      const response = await fetch(`http://localhost:8080/post/delete/${id}`, {
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
      <EditorContent editor={editor} />
      <Link to={`/editpost/${post.id}`}>
        <button>Edit</button>
      </Link>

      <button onClick={handleDeletePost}>Delete</button>

      <Link to="/">Back to List</Link>
    </div>
  );
}
