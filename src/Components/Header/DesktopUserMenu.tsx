import { Link } from "react-router-dom";
import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export default function DesktopUserMenu() {
  const { user, logout } = useUser();
  return (
    <div className="w-full h-full py-2 border-1 rounded-xl border-gray-300 bg-gray-100 ">
      <div className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 ">
        <Link to="/about">About</Link>
      </div>
      <div className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 ">
        Profile
      </div>
      {!user?.name && (
        <div>
          <div className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 ">
            <FaGithub />
            Sign in With Github
          </div>
          <div
            onClick={handleLogin}
            className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100"
          >
            <FcGoogle />
            Sign in With Google
          </div>
        </div>
      )}

      {user?.name && (
        <div
          onClick={logout}
          className="p-1 px-2 w-full hover:bg-blue-200 hover:cursor-pointer"
        >
          Logout
        </div>
      )}
    </div>
  );
}
