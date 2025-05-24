import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor | null;
}
const COLORS = [
  { name: "Purple", value: "#958DF1" },
  { name: "Red", value: "#F98181" },
  { name: "Orange", value: "#FBBC88" },
  { name: "Yellow", value: "#FAF594" },
  { name: "Blue", value: "#70CFF8" },
  { name: "Teal", value: "#94FADB" },
  { name: "Green", value: "#B9F18D" },
];

export default function ColorButton({ editor }: Props) {
  if (!editor) return null;

  const currentColor = editor.getAttributes("textStyle").color;

  return (
    <div className="space-y-3 p-3 bg-white dark:ink-bg-dark-50 border rounded-md shadow-sm w-fit">
      {/* Color Picker Input */}
      <div className="flex items-center gap-2"></div>

      {/* Preset Color Buttons */}
      <div className="flex flex-wrap gap-2">
        <input
          id="color-input"
          type="color"
          onInput={(event) =>
            editor
              .chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={currentColor || "#000000"}
          data-testid="setColor"
          className="w-8 h-8 p-0 border rounded"
        />
        {COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => editor.chain().focus().setColor(color.value).run()}
            className={`w-8 h-8 rounded-full border-2 transition duration-150 ${
              editor.isActive("textStyle", { color: color.value })
                ? "ring-2 ring-offset-2 ring-black"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            data-testid={`set${color.name}`}
          />
        ))}
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition duration-150 opacity-80 hover:opacity-100"
          title="Unset Color"
          data-testid="unsetColor"
        >
          <span className="text-4xl select-none text-red-500"></span>
        </button>
      </div>

      {/* Unset Color Button */}
      <div></div>
    </div>
  );
}
