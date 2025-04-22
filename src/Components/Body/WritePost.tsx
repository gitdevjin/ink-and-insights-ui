import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RichTextEditor from "../RichTextEditor";
import { Editor } from "@tiptap/react";
import { useCategory } from "../../hooks/use-category";

const API_URL = import.meta.env.VITE_API_URL;

export default function WritePost() {
  const navigate = useNavigate();
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const { categories } = useCategory();
  const [fileMappings, setFileMappings] = useState<
    { blobUrl: string; file: File }[]
  >([]);
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);

  const subCategory = categories
    .flatMap((cat) => cat.subCategories)
    .find((sub) => sub.id === Number(subCategoryId));

  if (!subCategory) {
    return <div>Subcategory not found</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (subCategoryId !== undefined) {
      formData.append("subcategory", subCategoryId);
    } else {
      // Handle the undefined case (e.g., throw an error, use a default, or skip)
      console.error("subCategoryId is undefined");
      return; // Or handle it appropriately
    }

    fileMappings.forEach(({ file, blobUrl }, index) => {
      formData.append("images", file);
      formData.append(`blobMapping:${index}`, blobUrl); // Send Blob URL mapping
    });

    // Debugging: Log formData entries
    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    try {
      const response = await fetch(`${API_URL}/post/write`, {
        method: "POST", // Specify the HTTP method
        body: formData, // Send formData directly (no need for Content-Type)
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const res = await response.json();

      editor.commands.clearContent();
      setFileMappings([]);
      setTitle("");
      console.log("Post saved:");
      console.log(res);
      navigate(`/post/read/${res.post.id}`);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <div>
      <h1 className="mb-4">{subCategory.name}</h1>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 w-full rounded-md focus:outline-none shadow-gray-300 shadow-md"
      />
      <RichTextEditor
        setFileMappings={setFileMappings}
        onEditorChange={setEditor}
      />
      <form onSubmit={handleSubmit}>
        <button className="basic-button h-10 w-24" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
