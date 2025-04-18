import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Note: Using web-safe fonts instead of imported fonts
// Space Mono and Inter will be loaded via CSS

createRoot(document.getElementById("root")!).render(<App />);
