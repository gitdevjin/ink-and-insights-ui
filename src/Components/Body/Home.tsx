import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";

export default function Home() {
  const { user, logout } = useUser();
  return (
    <div className="flex flex-col">
      <h1>Welcome, {user ? user?.name : "Guest"}</h1>
      <div
        onClick={handleLogin}
        style={{
          cursor: "pointer",
          padding: "10px",
          background: "#007BFF",
          color: "white",
        }}
      >
        Login
      </div>
      <div
        onClick={logout}
        style={{
          cursor: "pointer",
          padding: "10px",
          background: "green",
          color: "white",
        }}
      >
        Logout
      </div>
    </div>
  );
}
