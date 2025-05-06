import { createBrowserRouter, RouteObject } from "react-router-dom";

import Layout from "./Components/Layout";
import Home from "./Components/Body/Home";
import About from "./Components/Body/About";
import PostList from "./Components/Body/Post/PostList";
import OAuthCallback from "./auth/OAuthCallback";
import EditPost from "./Components/Body/Post/EditPost";
import WritePost from "./Components/Body/Post/WritePost";
import ReadPostOne from "./Components/Body/Post/ReadPostOne";
import Profile from "./Components/Body/Profile";
import Login from "./Components/Login";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "oauthcallback", element: <OAuthCallback /> },
      { path: "post/edit/:id", element: <EditPost /> },
      { path: "post/read/:id", element: <ReadPostOne /> },
      { path: "post/list/:subCategoryId", element: <PostList /> },
      { path: "post/write/:subCategoryId", element: <WritePost /> },
      { path: "user/profile/:id", element: <Profile /> },
      { path: "login", element: <Login /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
