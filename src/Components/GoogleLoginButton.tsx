import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function LoginButton() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(response) => {
          console.log("Login Success:", response);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
}
