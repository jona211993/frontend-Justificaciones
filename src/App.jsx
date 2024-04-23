import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import HomePage from "./pages/HomePage";
import RegistroPage from "./pages/RegistroPage";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/inicio" element={< InicioPage/>} />
          <Route path="/registrar" element={<RegistroPage />} />
          <Route path="/justificaciones" element={<h1>Justificaciones</h1>} />
          <Route
            path="/justificaciones/:id"
            element={<h1>Justificaciones por id</h1>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
