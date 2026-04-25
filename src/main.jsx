import React from "react";
import { createRoot } from "react-dom/client";
import FMScoutDashboard from "./FMScoutDashboard";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FMScoutDashboard />
  </React.StrictMode>
);
