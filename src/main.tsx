import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./hooks/use-user";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
