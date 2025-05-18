import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import MobileSideMenu from "../SideMenu/MobileSideMenu";

interface Props {
  isMobileSideMenuOpen?: boolean;
}

export default function MobileLayout({ isMobileSideMenuOpen }: Props) {
  useEffect(() => {
    if (isMobileSideMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Optional cleanup in case component unmounts while open
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileSideMenuOpen]);
  return (
    <main className="relative flex-grow mx-auto p-4 w-full min-h-screen overflow-y-auto">
      <div
        className={`${
          isMobileSideMenuOpen
            ? "fixed top-12 left-0 h-[calc(100vh-48px)] w-[80%] z-20 transition-all duration-400 overflow-y-auto"
            : "fixed top-12 -left-96 transition-all duration-400"
        }`}
      >
        <MobileSideMenu />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </main>
  );
}
