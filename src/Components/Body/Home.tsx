import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";

export default function Home() {
  const { user } = useUser();
  return (
    <div>
      Hello Home
      <div className="flex flex-col">
        <div>
          <h1>Welcome, {user ? user.name : "Guest"}</h1>
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
        </div>
      </div>
    </div>
  );
}
