import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import RichTextEditor from "../../RichTextEditor";
import { Editor } from "@tiptap/react";
import { useCategory } from "../../../hooks/use-category";

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export default function WritePostCustom() {
  const navigate = useNavigate();
  const { categories } = useCategory();
  const [fileMappings, setFileMappings] = useState<
    { blobUrl: string; file: File }[]
  >([]);
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | ""
  >("");

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value === "" ? "" : Number(e.target.value);
    setSelectedSubCategoryId(id);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedCategoryId(selectedId);

    const category = categories.find((cat) => cat.id.toString() === selectedId);
    setSubCategories(category?.subCategories || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    formData.append("subcategory", selectedCategoryId);

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
      <h1 className="mb-4 dark:text-gray-200">Create a New Post</h1>
      <div className="space-y-4 mb-5 sm:w-[50%]">
        {/* Category select */}
        <div className="flex flex-col">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={handleCategoryChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory select */}
        <div className="flex flex-col">
          <label
            htmlFor="subcategory"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Subcategory
          </label>
          <select
            id="subcategory"
            disabled={!subCategories.length}
            value={selectedSubCategoryId}
            onChange={handleSubCategoryChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Select Subcategory --</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-semibold pl-4 p-2 w-full rounded-md focus:outline-none shadow-gray-300 dark:shadow-gray-500 dark:text-gray-200 shadow-md bg-gray-100 dark:bg-gray-700"
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
