import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegistroPage from "./pages/RegistroPage";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import "./index.css";
import {FormularioJustificacion} from "./pages/FormularioJustificacion";
import ProtectecRoute from "./ProtectecRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      //rutas protejidas
      <Route element={<ProtectecRoute/>}>
        <Route path="/inicio/*" element={<InicioPage />} />
        <Route path="/registrar" element={<RegistroPage />} />
        <Route path="/formularioJustificacion" element={<FormularioJustificacion />}/>
      </Route>
      <Route path="/justificaciones" element={<h1>Justificaciones</h1>} />
      
    </Routes>
  );
}

export default App;
