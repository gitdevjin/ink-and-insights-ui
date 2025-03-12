import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className=" text-white p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-lg font-bold">
            Home
          </Link>
          <Link to="/post" className="text-lg">
            Post
          </Link>
          <Link to="/bookreviews" className="text-lg">
            Book Reviews
          </Link>
          <Link to="/about" className="text-lg">
            About
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-2">
        © 2024 My Website
      </footer>
    </div>
  );
}
