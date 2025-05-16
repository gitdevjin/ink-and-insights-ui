import { useState, useRef, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaRegMoon, FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuSun } from "react-icons/lu";
import { Link } from "react-router-dom";
import DesktopUserMenu from "./DesktopUserMenu";
import quill from "/quill.png";

export default function NavBar() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light"; // SSR safe
    return (
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSearch = () => {
    console.log("Search Clicked");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div id="navbar" className="fixed flex flex-col top-0 w-full z-10">
      {/* Navbar */}
      <nav className="flex justify-center bg-white dark:ink-bg-dark-100 w-full border-b border-gray-400 h-12 text-[#2b6cb0]">
        <div className="flex items-center justify-between relative h-full w-full px-4 md:px-8">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:hidden">
              <GiHamburgerMenu className="w-full h-full aspect-square" />
            </div>
            <Link to="/" className="flex items-center">
              <img className="w-8 h-6 sm:w-12 sm:h-10" src={quill} alt="logo" />
              <div className="flex-row sm:flex-col ml-1 font-semibold flex">
                <span>Ink &&nbsp;</span>
                <span>Insights</span>
              </div>
            </Link>
          </div>

          {/* Middle Section - Search Box (Centered Vertically) */}
          <div className="hidden absolute md:block left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              onClick={handleSearch}
              className="absolute flex items-center justify-center rounded-lg right-0 top-1/2 transform -translate-y-1/2 h-full aspect-square hover:bg-[#e1f1fc]/50 cursor-pointer"
            >
              <FaSearch className="" />
            </div>
          </div>

          {/* Right Section - Icons */}
          <div className="flex items-center gap-1">
            <div
              onClick={toggleTheme}
              className="flex items-center rounded-lg justify-center w-9 h-9 hover:bg-[#e1f1fc]/50"
            >
              {theme === "dark" ? (
                <LuSun className="rounded-full w-7 h-7 cursor-pointer" />
              ) : (
                <FaRegMoon className="w-full h-6 cursor-pointer " />
              )}

              {/**/}
            </div>
            <div
              onClick={() => setIsUserMenuOpen((prev: boolean) => !prev)}
              className="relative flex items-center rounded-lg justify-center w-9 h-9 hover:bg-[#e1f1fc]/50 text-gray-400"
            >
              <MdAccountCircle className="w-9 h-9 cursor-pointer" />
            </div>

            <div
              ref={menuRef}
              className={`${
                isUserMenuOpen
                  ? "opacity-100 scale-100 max-h-96"
                  : "opacity-0 scale-95 max-h-0 pointer-events-none"
              } absolute top-13 right-4 w-52 transition-all duration-300 ease-in-out transform`}
            >
              <DesktopUserMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
