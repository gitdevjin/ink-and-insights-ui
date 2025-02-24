import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const RichTextEditor: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

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
        setFiles((prev) => [...prev, file]);
      }
    };
  }, [editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const content = editor.getHTML();
    const formData = new FormData();
    formData.append("content", content);

    console.log("Files to upload:", files.length);
    files.forEach((file) => {
      formData.append("images", file);
    });

    // ✅ Debugging: Log formData entries
    console.log("Logging FormData:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Shows key-value pairs
    }
    try {
      const response = await fetch("http://localhost:8080/post/test", {
        method: "POST", // Specify the HTTP method
        body: formData, // Send formData directly (no need for Content-Type)
      });

      //console.log(formData);
      //console.log(files);
      //console.log(content);
      //console.log(formData.getAll);
      const data = await response.json();
      console.log(data);
      // editor.commands.clearContent();

      setFiles([]);
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
};

export default RichTextEditor;
