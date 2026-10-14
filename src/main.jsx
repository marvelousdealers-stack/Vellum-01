import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { BASE_URL, USE_MOCK } from "./api/client";

// While there is no backend, a fake server (src/mocks) answers API requests.
// It is imported dynamically so a production build with VITE_USE_MOCK=false
// doesn't ship it. See src/mocks/README.md.
const start = async () => {
  if (USE_MOCK) {
    const { installMockServer } = await import("./mocks/server");
    installMockServer({ baseUrl: BASE_URL });
  }
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

start();
