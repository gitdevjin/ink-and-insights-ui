import React, { useState } from "react";
import RichTextEditor from "../RichTextEditor";
import { Editor } from "@tiptap/react";

export default function TestEditor() {
  const [fileMappings, setFileMappings] = useState<
    { blobUrl: string; file: File }[]
  >([]);
  const [title, setTitle] = useState("");
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", "bookreview"); // will be dynamically coded soon.

    fileMappings.forEach(({ file, blobUrl }, index) => {
      formData.append("images", file);
      formData.append(`blobMapping:${index}`, blobUrl); // Send Blob URL mapping
    });

    // Debugging: Log formData entries
    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    try {
      const response = await fetch("http://localhost:8080/post/write", {
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
      console.log(res.message);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

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
