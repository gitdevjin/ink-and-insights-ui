import React, { useState, useEffect } from "react";
import RichTextEditor from "../../RichTextEditor";
import { Editor } from "@tiptap/react";
import { useParams } from "react-router-dom";

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
}

interface Image {
  id: number;
  url: string;
  postId: number;
  createdAt: string; // or Date if needed
}

export default function EditPost() {
  console.log("Edit Post Called");
  const { id } = useParams();
  const [fileMappings, setFileMappings] = useState<
    { blobUrl: string; file: File }[]
  >([]);
  const [prevImages, setPrevImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | undefined>(undefined);

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
          setTitle(fetchedPost.title);
          editor?.commands.setContent(fetchedPost.content); // Set content here
          setPrevImages(fetchedPost.images.map((img: Image) => img.url));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    fileMappings.forEach(({ file, blobUrl }, index) => {
      formData.append("images", file);
      formData.append(`blobMapping:${index}`, blobUrl); // Send Blob URL mapping
    });

    // Debugging: Log formData entries
    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    const deletedImages = prevImages.filter(
      (url: string) => !content.includes(url)
    );

    deletedImages.forEach((url, index) => {
      formData.append(`deletedImages${index}`, url); // Start at 1 for clarity
    });

    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    console.log("==Deleted Image==START");
    console.log(deletedImages);
    console.log("==Deleted Image==END");

    try {
      const response = await fetch(`http://localhost:8080/post/edit/${id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const res = await response.json();

      editor.commands.clearContent();
      setFileMappings([]);
      setTitle("");
      console.log(res.message);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded p-2 w-full mb-2"
      />
      <RichTextEditor
        setFileMappings={setFileMappings}
        onEditorChange={setEditor}
      />
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
