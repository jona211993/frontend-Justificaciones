
import { Route, Routes } from "react-router-dom";
import { Home } from "../../pages/views/Home";
import { Empleados } from "../../pages/views/Empleados";
import Justificaciones  from "../../pages/views/Justificaciones";
import {FormularioJustificacion} from "../../pages/FormularioJustificacion";
import { VerJustificacion } from "../../pages/views/VerJustificacion";
import { CargaPruebas } from "../../pages/views/CargaPruebas";
import { RegistrarSolicitudVacaciones } from "../../pages/views/RegistrarSolicitudVacaciones";
import { MisSolicitudes } from "../../pages/views/MisSolicitudes";
import { SolicitudesEquipo } from "../../pages/views/SolicitudesEquipo";
import { VerSolicitudVacaciones } from "../../pages/views/VerSolicitudVacaciones";

import { SolicitudesAprobadasGerencia } from "../../pages/views/SolicitudesAprobadasGerencia";
import { SolicitudesEnProcesoGerencia } from "../../pages/views/SolicitudesEnProcesoGerencia";
import { VerSolicitudAprobada } from "../../pages/views/VerSolicitudAprobada";
import { CalendarioJefes } from "../../pages/views/CalendarioJefes";
import FormularioVacacionesAsesor from "../../pages/views/FormularioVacacionesAsesor";
import SolicitudesAsesores from "../../pages/views/SolicitudesAsesores";
import DetalleEmpleado from "../../pages/views/DetalleEmpleado";
import EmpleadosAlertaVacaciones from "../../pages/views/EmpleadosAlertaVacaciones";
 
export const ContentView = () => {
  return (
    <div className=" h-full overflow-auto  pt-10" >     

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/empleados" element={<Empleados />}></Route>
        <Route path="/crearJust" element={<FormularioJustificacion></FormularioJustificacion>}></Route>
        <Route path="/justificaciones" element={<Justificaciones />}></Route>
        <Route path="/verJustificacion" element={<VerJustificacion />} ></Route>
        <Route path="/cargaPruebas" element={<CargaPruebas />} ></Route>
        <Route path="/crearSolicitudVacaciones" element={<RegistrarSolicitudVacaciones/>} ></Route>
        <Route path="/listarSolicitudes" element={<MisSolicitudes/>} ></Route>
        <Route path="/solicitudesEquipo" element={<SolicitudesEquipo/>} ></Route>
        <Route path="/verSolicitudVacaciones" element={<VerSolicitudVacaciones/>} ></Route>
        <Route path="/verSolicitudAprobada" element={<VerSolicitudAprobada/>} ></Route>
        <Route path="/solicitudesAprobadasGerencia" element={<SolicitudesAprobadasGerencia/>} ></Route>
        <Route path="/solicitudesEnProcesoGerencia" element={<SolicitudesEnProcesoGerencia/>} ></Route>
        <Route path="/calendario" element={<CalendarioJefes/>} ></Route>
         {/* Para Registro de vacaciones Asesores */}
        <Route path="/registrarVacacionesAsesor" element={<FormularioVacacionesAsesor/>} ></Route>
        <Route path="/listarSolicitudesAsesores" element={<SolicitudesAsesores/>} ></Route>
        <Route path="/detalleEmpleado/:idEmpleado" element={<DetalleEmpleado/>} ></Route>
        <Route path="/empleadosAlertaVacaciones" element={<EmpleadosAlertaVacaciones/>} ></Route>
        </Routes>
    </div>
  );
};
