import { Link } from "react-router-dom";
import { useCategory } from "../../hooks/use-category";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export default function DesktopSideMenu() {
  const { categories } = useCategory();
  const [openCategories, setOpenCategories] = useState<number[]>([]);

  const toggleCategory = (categoryId: number) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="hidden sm:flex top-0 sm:flex-col">
      <div>
        <h2>CATEGORY</h2>
        <ul>
          {categories.map((category) => {
            const isOpen = openCategories.includes(category.id);
            return (
              <li className="m-1.5 " key={category.id}>
                <div
                  className="flex flex-row justify-between items-center cursor-pointer hover:bg-gray-300 p-2 rounded"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div>{category.name}</div>
                  <span
                    className={`${
                      isOpen
                        ? "mr-2 transition-transform duration-300"
                        : "mr-2 transition-transform duration-300 rotate-180"
                    }`}
                  >
                    <IoIosArrowUp />
                  </span>
                </div>
                <ul
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{
                    height: isOpen
                      ? `${category.subCategories.length * 40}px`
                      : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  {category.subCategories.map((sub) => (
                    <li
                      className="ml-3 p-2 border-l border-l-gray-300 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 cursor-pointer rounded-tr-lg rounded-br-lg "
                      key={sub.id}
                    >
                      <Link
                        className="hover:text-[#2b6cb0]"
                        to={`/post/list/${sub.id}`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <div>Temp Menu</div>
    </div>
  );
}
