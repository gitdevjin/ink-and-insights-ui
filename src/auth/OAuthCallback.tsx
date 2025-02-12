import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/use-user";

const OAuthCallback = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    const code = params.get("access_token");

    if (code) {
      login(code)
        .then(() => {
          navigate("/"); // Redirect to home after login
        })
        .catch((error) => {
          console.error("Login failed:", error);
          navigate("/"); // Redirect to login page on failure
        });
    } else {
      console.error("No authorization code found in URL");
      navigate("/");
    }
  }, [login, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthCallback;
