const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const handleLogin = () => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:5173/oauthcallback&response_type=token&scope=email%20profile`;
  window.location.href = googleAuthUrl;
};
