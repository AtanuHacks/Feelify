import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MainApp from "./MainApp";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  </React.StrictMode>
);