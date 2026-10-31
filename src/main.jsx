
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "@fortawesome/fontawesome-free/css/all.min.css";
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Auth Context
import AuthContextProvider from "./contexts/authContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
    <HeroUIProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </HeroUIProvider>
  </StrictMode>
);

