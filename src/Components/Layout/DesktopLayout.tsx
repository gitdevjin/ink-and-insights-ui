import { Outlet } from "react-router-dom";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaAngleLeft } from "react-icons/fa6";
import DesktopSideMenu from "../SideMenu/DesktopSideMenu";

export default function DesktopLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div
      className={`grid justify-center h-screen w-full overflow-hidden transition-all duration-400 ease-in-out ${
        isSidebarOpen ? "grid-cols-[256px_1fr]" : "grid-cols-[64px_1fr]"
      }`}
    >
      {/* Sidebar */}
      <aside className="relative bg-gray-100 dark:ink-bg-dark-50 dark:border-gray-500 border-r border-gray-400 p-4 flex flex-col z-5 overflow-y-scroll overflow-x-hidden overscroll-contain">
        <div className="relative w-full">
          <div className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <DesktopSideMenu />
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`${isSidebarOpen ? "translate-x-48" : "translate-x-0"} fixed top-15 left-11.5 transition-all duration-400 ease-in-out z-15 w-8 h-8 rounded-full border border-gray-400 text-gray-400 bg-[#f5f4f4]`}
          >
            {isSidebarOpen ? (
              <FaAngleLeft className="w-full h-full pr-0.25 pt-0.5 pb-0.5 cursor-pointer" />
            ) : (
              <GiHamburgerMenu className="w-full h-full p-1 cursor-pointer" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex justify-center dark:ink-bg-dark-50 w-full p-12 h-full overflow-x-hidden overflow-y-scroll overscroll-contain">
        <div className="w-[80%]">
          <Outlet />
          <div className="h-20 dark:ink-bg-dark-50"></div>
        </div>
      </main>
    </div>
  );
}
