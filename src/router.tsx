import { createBrowserRouter, RouteObject } from "react-router-dom";

import Layout from "./Components/Layout";
import Home from "./Components/Body/Home";
import About from "./Components/Body/About";
import PostList from "./Components/Body/PostList";
import OAuthCallback from "./auth/OAuthCallback";

import TestEditor from "./Components/Body/TestEditor";
import EditPost from "./Components/Body/EditPost";
import WritePost from "./Components/Body/WritePost";
import ReadPostOne from "./Components/Body/ReadPostOne";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "oauthcallback", element: <OAuthCallback /> },
      { path: "testeditor", element: <TestEditor /> },
      { path: "post/edit/:id", element: <EditPost /> },
      { path: "post/read/:id", element: <ReadPostOne /> },
      { path: "post/list/:subCategoryId", element: <PostList /> }, // Single route
      { path: "post/write/:subCategoryId", element: <WritePost /> }, // Single route
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
