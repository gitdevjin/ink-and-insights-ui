import { Link } from "react-router-dom";
import { useCategory } from "../../hooks/use-category";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/use-user";

export default function DesktopSideMenu() {
  const navigate = useNavigate();
  const { user } = useUser();
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
    <div className="h-screen hidden sm:flex top-0 sm:flex-col">
      <div>
        <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg">
          CATEGORIES
        </div>
        <ul>
          {categories.map((category) => {
            const isOpen = openCategories.includes(category.id);
            return (
              <li className="m-1.5 " key={category.id}>
                <div
                  className="flex flex-row justify-between items-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-400 p-2 rounded"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-300">
                    {category.name}
                  </div>
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
                      className="ml-3 p-2 border-l border-l-gray-300 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 dark:text-gray-200 cursor-pointer rounded-tr-lg rounded-br-lg "
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
      <div
        onClick={() => {
          if (user?.userId) {
            navigate(`user/profile/${user.userId}`);
          } else {
            navigate("/login");
          }
        }}
        className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg "
      >
        My Profile
      </div>
      <div
        onClick={() => {
          if (user?.userId) {
            navigate(`user/activity`);
          } else {
            navigate("/login");
          }
        }}
        className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg"
      >
        My Activity
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Settings
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 1
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 2
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 3
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 4
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 5
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 6
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 7
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 8
      </div>
      <div className="text-md p-1 my-0.5 font-semibold text-gray-700 dark:text-gray-400 hover:text-[#2b6cb0] hover:border-l-blue-300 hover:bg-gray-200 dark:hover:bg-gray-400 cursor-pointer rounded-lg">
        Mock Menu 9
      </div>
    </div>
  );
}
