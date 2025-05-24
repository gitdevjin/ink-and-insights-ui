import {
  FaBold,
  FaCode,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaFileCode,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaImage,
} from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { Editor } from "@tiptap/react";
import ToolButton from "./ToolButton";
import ColorButton from "./ColorButton";
import { useState, useRef, useEffect } from "react";

interface Props {
  editor: Editor | null;
  addImage: () => void;
}

const tools = [
  {
    task: "color",
    icon: <IoIosColorPalette size={20} />,
  },
  {
    task: "bold",
    icon: <FaBold size={20} />,
  },
  {
    task: "italic",
    icon: <FaItalic size={20} />,
  },
  {
    task: "underline",
    icon: <FaUnderline size={20} />,
  },
  {
    task: "strike",
    icon: <FaStrikethrough size={20} />,
  },
  {
    task: "code",
    icon: <FaCode size={20} />,
  },
  {
    task: "codeBlock",
    icon: <FaFileCode size={20} />,
  },
  {
    task: "left",
    icon: <FaAlignLeft size={20} />,
  },
  {
    task: "center",
    icon: <FaAlignCenter size={20} />,
  },
  {
    task: "right",
    icon: <FaAlignRight size={20} />,
  },
  {
    task: "bulletList",
    icon: <FaListUl size={20} />,
  },
  {
    task: "orderedList",
    icon: <FaListOl size={20} />,
  },
  {
    task: "image",
    icon: <FaImage size={20} />,
  },
] as const;

type TaskType = (typeof tools)[number]["task"];
export default function ToolBox({ editor, addImage }: Props) {
  const [showPalette, setShowPalette] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const togglePalette = () => setShowPalette((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If clicking outside the palette div, hide it
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowPalette(false);
      }
    }

    if (showPalette) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener on unmount or when showPalette changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPalette]);

  const handleOnClick = (task: TaskType) => {
    if (!editor) return;
    switch (task) {
      case "color":
        return togglePalette();
      case "bold":
        return editor.chain().focus().toggleBold().run();
      case "italic":
        return editor.chain().focus().toggleItalic().run();
      case "underline":
        return editor.chain().focus().toggleUnderline().run();
      case "strike":
        return editor.chain().focus().toggleStrike().run();
      case "code":
        return editor.chain().focus().toggleCode().run();
      case "codeBlock":
        return editor.chain().focus().toggleCodeBlock().run();
      case "orderedList":
        return editor.chain().focus().toggleOrderedList().run();
      case "bulletList":
        return editor.chain().focus().toggleBulletList().run();
      case "left":
        return editor.chain().focus().setTextAlign("left").run();
      case "center":
        return editor.chain().focus().setTextAlign("center").run();
      case "right":
        return editor.chain().focus().setTextAlign("right").run();
      case "image":
        return addImage();
    }
  };

  const isTaskDisabled = (task: TaskType): boolean => {
    if (!editor) return true; // If editor is not available, the task is disabled

    switch (task) {
      case "bold":
        return !editor.can().chain().focus().toggleBold().run();
      case "italic":
        return !editor.can().chain().focus().toggleItalic().run();
      case "underline":
        return !editor.can().chain().focus().toggleUnderline().run();
      case "strike":
        return !editor.can().chain().focus().toggleStrike().run();
      case "code":
        return !editor.can().chain().focus().toggleCode().run();
      case "codeBlock":
        return !editor.can().chain().focus().toggleCodeBlock().run();
      case "orderedList":
        return !editor.can().chain().focus().toggleOrderedList().run();
      case "bulletList":
        return !editor.can().chain().focus().toggleBulletList().run();
      case "left":
        return !editor.can().chain().focus().setTextAlign("left").run();
      case "center":
        return !editor.can().chain().focus().setTextAlign("center").run();
      case "right":
        return !editor.can().chain().focus().setTextAlign("right").run();
      case "image":
        return false; // Assuming `addImage()` can always run unless specific conditions are set
    }

    return false;
  };

  return (
    <div>
      <div className="relative flex flex-row flex-wrap" ref={ref}>
        {showPalette && (
          <div className="absolute mt-2 z-10">
            <ColorButton editor={editor} />
          </div>
        )}
        {tools.map(({ task, icon }) => {
          return (
            <div className="flex items-center justify-center p-1 m-1 border-1">
              <ToolButton
                key={task}
                onClick={() => handleOnClick(task)}
                disabled={isTaskDisabled(task)}
                active={
                  editor?.isActive(task) ||
                  editor?.isActive({ textAlign: task })
                }
              >
                {icon}
              </ToolButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
