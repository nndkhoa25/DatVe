import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import RouterConfig from "./router.jsx";
import { AuthProvider } from "./context/AuthContext";
import "flowbite";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RouterConfig />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
