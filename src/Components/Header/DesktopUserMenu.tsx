// import { Link } from "react-router-dom";
import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";
import { CgProfile, CgFileDocument } from "react-icons/cg";

import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineExitToApp } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function DesktopUserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  return (
    <div className="w-full h-full py-2 border-1 rounded-lg text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-500 bg-white dark:ink-bg-dark-100 text-md font-semibold">
      {user?.name && (
        <div
          onClick={() => navigate(`user/profile/${user.userId}`)}
          className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 dark:hover:ink-bg-dark-50"
        >
          <CgProfile /> Profile
        </div>
      )}
      {user?.name && (
        <div
          onClick={() => navigate(`user/activity`)}
          className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 dark:hover:ink-bg-dark-50"
        >
          <CgFileDocument /> Activity
        </div>
      )}
      {!user?.name && (
        <div>
          <div className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 dark:hover:ink-bg-dark-50">
            <FaGithub />
            Sign in With Github
          </div>
          <div
            onClick={handleLogin}
            className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 dark:hover:ink-bg-dark-50"
          >
            <FcGoogle />
            Sign in With Google
          </div>
        </div>
      )}

      {user?.name && (
        <div
          onClick={logout}
          className="px-2 py-1 flex flex-row items-center gap-2 w-full hover:cursor-pointer hover:bg-blue-100 dark:hover:ink-bg-dark-50"
        >
          <MdOutlineExitToApp /> Logout
        </div>
      )}
    </div>
  );
}
