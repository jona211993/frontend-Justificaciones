import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../../pages/views/Home";
import { Empleados } from "../../pages/views/Empleados";
import { Justificaciones } from "../../pages/views/Justificaciones";
import {FormularioJustificacion} from "../../pages/FormularioJustificacion"
 
export const ContentView = () => {
  return (
    <div className="bg-cyan-600 h-screen">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/empleados" element={<Empleados />}></Route>
        <Route path="/justificaciones" element={<Justificaciones />}></Route>
        <Route path="/crearJust" element={<FormularioJustificacion></FormularioJustificacion>}></Route>
        
        /inicio/crearJust
      </Routes>
    </div>
  );
};
