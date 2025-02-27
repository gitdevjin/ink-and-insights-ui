import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export default function RichTextEditor() {
  const [fileMappings, setFileMappings] = useState<
    { blobUrl: string; file: File }[]
  >([]);

  // Configure TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true, // Images can be inline with text
        allowBase64: false, // We’ll use Blob URLs instead
      }),
    ],
    content: "", // Initial content
  });

  // Custom image handler
  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      console.log(file);
      if (file && editor) {
        const blobUrl = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: blobUrl }).run();
        setFileMappings((prev) => [...prev, { blobUrl, file }]);
      }
    };
  }, [editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const formData = new FormData();
    formData.append("content", content);

    fileMappings.forEach(({ file, blobUrl }, index) => {
      formData.append("images", file);
      formData.append(`blobMapping:${index}`, blobUrl); // Send Blob URL mapping
    });

    // Debugging: Log formData entries
    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    try {
      const response = await fetch("http://localhost:8080/post/test", {
        method: "POST", // Specify the HTTP method
        body: formData, // Send formData directly (no need for Content-Type)
      });

      const res = await response.json();

      editor.commands.clearContent();
      setFileMappings([]);
      console.log("Post saved:", res.data);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  if (!editor) return null;

  return (
    <div>
      <div className="toolbar">
        <button
          className="w-30 border-0 rounded-4xl bg-amber-200"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button onClick={addImage}>Add Image</button>
      </div>
      <EditorContent editor={editor} />
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
