// import { Link } from "react-router-dom";
import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";
import { CgProfile } from "react-icons/cg";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineExitToApp } from "react-icons/md";

export default function DesktopUserMenu() {
  const { user, logout } = useUser();
  return (
    <div className="w-full h-full py-2 border-1 rounded-lg text-gray-700 border-gray-300 bg-white text-md font-semibold">
      {user?.name && (
        <div className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 ">
          <CgProfile /> Profile
        </div>
      )}
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
          className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100"
        >
          <MdOutlineExitToApp /> Logout
        </div>
      )}
    </div>
  );
}
