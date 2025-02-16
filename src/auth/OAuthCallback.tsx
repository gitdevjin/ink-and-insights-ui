import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/use-user";

const OAuthCallback = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    const googleToken = params.get("access_token");

    if (googleToken) {
      login(googleToken)
        .then(() => {
          navigate("/"); // Redirect to home after login
        })
        .catch((error) => {
          console.error("Login failed:", error);
          navigate("/"); // Redirect to login page on failure
        });
    } else {
      console.log("No authorization code found in URL");
      navigate("/");
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthCallback;
