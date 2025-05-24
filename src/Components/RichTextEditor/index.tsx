import { useCallback, useEffect } from "react";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import ToolBox from "./ToolBox";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

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
      TextStyle,
      Color,
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
    <div className="my-5 space-y-3">
      <ToolBox editor={editor} addImage={addImage} />

      <div
        id="rich-text-content"
        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 shadow-md transition"
      >
        <EditorContent
          editor={editor}
          className="h-[60vh] p-4 overflow-y-auto prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none"
          placeholder="Enter content..."
        />
      </div>
    </div>
  );
}
