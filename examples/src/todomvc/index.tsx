import { HashRouter, Route, Routes } from "react-router-dom";

import "todomvc-app-css/index.css";
import { App } from "./todo/app";

export function TodoMvc() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </HashRouter>
  );
}
