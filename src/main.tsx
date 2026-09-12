<<<<<<< HEAD
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Silence THREE.Clock deprecation warning from R3F internals
const warn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  warn(...args);
};

createRoot(document.getElementById("root")!).render(<App />);
=======
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
>>>>>>> 7feb5232bc6bf69f2a63a3b8eb4aded3523b4430
