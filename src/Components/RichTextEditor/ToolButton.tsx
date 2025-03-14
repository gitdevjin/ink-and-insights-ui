import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  active?: boolean;
  onClick?(): void;
  disabled?: boolean;
}

export default function ToolButton({
  children,
  active,
  onClick,
  disabled,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={active ? "bg-black text-white" : "text-black"}
    >
      {children}
    </button>
  );
}
