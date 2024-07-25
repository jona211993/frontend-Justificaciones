import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../../pages/views/Home";
import { Empleados } from "../../pages/views/Empleados";
import { Justificaciones } from "../../pages/views/Justificaciones";
import {FormularioJustificacion} from "../../pages/FormularioJustificacion"
import { VerJustificacion } from "../../pages/views/VerJustificacion";
import { CargaPruebas } from "../../pages/views/CargaPruebas";
import { RegistrarSolicitudVacaciones } from "../../pages/views/RegistrarSolicitudVacaciones";
 
export const ContentView = () => {
  return (
    <div className=" h-full overflow-auto" >     

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/empleados" element={<Empleados />}></Route>
        <Route path="/crearJust" element={<FormularioJustificacion></FormularioJustificacion>}></Route>
        <Route path="/justificaciones" element={<Justificaciones />}></Route>
        <Route path="/verJustificacion" element={<VerJustificacion />} ></Route>
        <Route path="/cargaPruebas" element={<CargaPruebas />} ></Route>
        <Route path="/crearSolicitudVacaciones" element={<RegistrarSolicitudVacaciones/>} ></Route>
        </Routes>
    </div>
  );
};
