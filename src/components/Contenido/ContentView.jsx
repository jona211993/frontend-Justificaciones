import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../../pages/views/Home";
import { Empleados } from "../../pages/views/Empleados";
import { Justificaciones } from "../../pages/views/Justificaciones";
import {FormularioJustificacion} from "../../pages/FormularioJustificacion"
import { VerJustificacion } from "../../pages/views/VerJustificacion";
 
export const ContentView = () => {
  return (
    <div className="bg-gray-100 h-screen overflow-auto">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/empleados" element={<Empleados />}></Route>
        <Route path="/crearJust" element={<FormularioJustificacion></FormularioJustificacion>}></Route>
        <Route path="/justificaciones" element={<Justificaciones />}></Route>
        <Route path="/verJustificacion" element={<VerJustificacion />} ></Route>
        </Routes>
    </div>
  );
};
