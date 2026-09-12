import React from 'react'
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Silence THREE.Clock deprecation warning from R3F internals
const warn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  warn(...args);
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
