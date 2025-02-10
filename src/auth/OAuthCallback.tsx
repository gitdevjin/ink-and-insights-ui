import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Send the token to your backend for validation or use it directly
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User Data:", data);
          // Now you can use the data to log the user in or save to your backend
        })
        .catch((error) => {
          console.log("Error fetching user data:", error);
        });
    }
  }, []);

  return <div>Redirecting...</div>;
}
