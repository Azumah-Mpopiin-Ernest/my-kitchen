import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
const app = createRoot(document.getElementById("root"));

app.render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);
