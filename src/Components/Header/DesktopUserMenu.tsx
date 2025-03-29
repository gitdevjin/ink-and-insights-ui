import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";

export default function DesktopUserMenu() {
  const { user, logout } = useUser();
  return (
    <div className="w-full h-full border-1 rounded-xl border-gray-300 bg-gray-100 ">
      <div>desktop</div>
      <div>Profile</div>
      <div className="px-2 bg-amber-100 w-full">Sign in With Github</div>
      <div onClick={handleLogin} className="hover:cursor-pointer">
        Sign in With Google
      </div>
      {user?.name && (
        <div
          onClick={logout}
          className="p-2 w-full hover:bg-blue-200 hover:cursor-pointer"
        >
          Logout
        </div>
      )}
    </div>
  );
}
