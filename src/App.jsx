import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegistroPage from "./pages/RegistroPage";
import LoginPage from "./pages/LoginPage";
import InicioPage from "./pages/InicioPage";
import "./index.css";
import {FormularioJustificacion} from "./pages/FormularioJustificacion";
import ProtectecRoute from "./ProtectecRoute";
import Justificaciones from "./pages/views/Justificaciones";
import SelectBuscador from "./components/buscador/SelectBuscador"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      //rutas protejidas
      <Route element={<ProtectecRoute/>}>
        <Route path="/expertisRH/*" element={<InicioPage />} />
        <Route path="/registrar" element={<RegistroPage />} />
        <Route path="/formularioJustificacion" element={<FormularioJustificacion />}/>
        <Route path="/justificaciones" element={<Justificaciones/>} />
      </Route>
      <Route path="/vacaciones" element={<SelectBuscador/>} />
      
    </Routes>
  );
}

export default App;
