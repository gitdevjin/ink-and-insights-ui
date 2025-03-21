import { Outlet } from "react-router-dom";

export default function MobileLayout() {
  return (
    <main className="flex-grow mx-auto p-4 w-full min-h-screen overflow-y-auto">
      <Outlet />
    </main>
  );
}
