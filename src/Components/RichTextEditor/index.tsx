import { useCallback, useEffect } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import ToolBox from "./ToolBox";

interface FileMapping {
  blobUrl: string;
  file: File;
}

interface Props {
  setFileMappings: React.Dispatch<React.SetStateAction<FileMapping[]>>;
  onEditorChange: React.Dispatch<React.SetStateAction<Editor | null>>;
}

export default function RichTextEditor({
  setFileMappings,
  onEditorChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true, // Images can be inline with text
        allowBase64: false, // We’ll use Blob URLs instead
      }),
      TextAlign.configure({
        types: ["paragraph"],
      }),
    ],
    content: "", // Initial content
  });

  useEffect(() => {
    if (editor && onEditorChange) {
      onEditorChange(editor);
    }
  }, [editor, onEditorChange]);

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

  return (
    <div className="my-5 ">
      <ToolBox editor={editor} addImage={addImage} />
      <div
        id="rich-text-content"
        className="my-1 h-screen rounded-lg focus:outline-none shadow-gray-300 shadow-lg"
      >
        <EditorContent
          editor={editor}
          className="h-screen focus:outline-none"
          placeholder="Enter Content"
        />
      </div>
    </div>
  );
}
