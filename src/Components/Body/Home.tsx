import { handleLogin } from "../../auth/login";
import { useUser } from "../../hooks/use-user";

export default function Home() {
  const { user, logout } = useUser();
  const accessToken = localStorage.getItem("accessToken");

  const authTest = async () => {
    const response = await fetch("http://localhost:8080/auth/test", {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Attach the token
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col w-full">
      <h4>Welcome, {user ? user?.name : "Guest"}</h4>
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
      <div
        onClick={authTest}
        style={{
          cursor: "pointer",
          padding: "10px",
          background: "grey",
          color: "white",
        }}
      >
        AuthTest
      </div>
      <div className="h-screen"></div>
    </div>
  );
}
