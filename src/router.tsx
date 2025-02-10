import { createBrowserRouter, RouteObject } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Body/Home";
import About from "./Components/Body/About";
import OAuthCallback from "./auth/OAuthCallback";

const routes: RouteObject[] = [
  // ✅ Explicitly typed array
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "oauthcallback", element: <OAuthCallback /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
