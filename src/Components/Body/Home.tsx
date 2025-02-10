import { handleLogin } from "../../auth/login";

export default function Home() {
  return (
    <div>
      Hello Home
      <div className="flex flex-col">
        <div>Google Login</div>
        <div>
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
