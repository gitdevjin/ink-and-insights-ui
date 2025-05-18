import { useState, useEffect } from "react";
import NavBar from "../Header/NavBar";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

export default function Layout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isMobileSideMenuOpen, setIsMobileSideMenuOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="layout-index" className="flex flex-col pt-12 dark:ink-bg-dark-50">
      <NavBar setIsMobileSideMenuOpen={setIsMobileSideMenuOpen} />
      {isMobile ? (
        <MobileLayout isMobileSideMenuOpen={isMobileSideMenuOpen} />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
