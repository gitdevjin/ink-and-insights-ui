import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
}: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`px-2 py-1 rounded-md text-xl ${
          currentPage === 1
            ? "bg-gray-100 dark:bg-gray-500 text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-[#e1f1fc]/50 cursor-pointer"
        } transition-colors duration-200`}
      >
        <MdOutlineKeyboardDoubleArrowLeft />
      </button>
      <div className="text-gray-600 dark:text-gray-200 flex flex-row gap-2 justify-center items-center">
        <span>{currentPage}</span> <span>of</span> <span>{totalPages}</span>
      </div>
      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className={`px-2 py-1 rounded-md text-xl  ${
          currentPage >= totalPages
            ? "bg-gray-100 dark:bg-gray-500 text-gray-400  cursor-not-allowed"
            : " text-blue-600 hover:bg-[#e1f1fc]/50 cursor-pointer"
        } transition-colors duration-200`}
      >
        <MdOutlineKeyboardDoubleArrowRight />
      </button>
    </div>
  );
}
