//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./hooks/use-user";
import { RouterProvider } from "react-router-dom";
import { CategoryProvider } from "./hooks/use-category";
import router from "./router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
  <UserProvider>
    <CategoryProvider>
      <RouterProvider router={router} />
    </CategoryProvider>
  </UserProvider>
  //</StrictMode>
);
