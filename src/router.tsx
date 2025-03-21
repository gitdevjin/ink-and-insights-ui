import { createBrowserRouter, RouteObject } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Body/Home";
import About from "./Components/Body/About";
import Post from "./Components/Body/Post";
import OAuthCallback from "./auth/OAuthCallback";
import BookReviewList from "./Components/BookReview/BookReviewList";
import BookReviewOne from "./Components/BookReview/BookReviewOne";
import TestEditor from "./Components/Body/TestEditor";
import EditPost from "./Components/Body/EditPost";

const routes: RouteObject[] = [
  // ✅ Explicitly typed array
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "post", element: <Post /> },
      { path: "oauthcallback", element: <OAuthCallback /> },
      { path: "bookreview/:id", element: <BookReviewOne /> },
      { path: "bookreviews", element: <BookReviewList /> },
      { path: "testeditor", element: <TestEditor /> },
      { path: "editpost/:id", element: <EditPost /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
