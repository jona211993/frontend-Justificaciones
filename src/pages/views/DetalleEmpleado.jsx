/* eslint-disable react-hooks/exhaustive-deps */

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Col, Row, Statistic } from "antd";
import axios from "../../API/axios.js";
import { listarEmpleadosStaffRequest } from "../../API/empleadosStaff.js";
import dayjs from 'dayjs';

const DetalleEmpleado = () => {
  const { idEmpleado } = useParams(); // 'id' es el nombre que aparece en la ruta
  const [saldoVacaciones, setSaldoVacaciones] = useState(null);
  const [vacacionestruncas, setVacacionesTruncas] = useState(null);
  const [vacacionesPendientes, setVacacionesPendientes] = useState(null);
  const [vacacionesVencidas, setVacacionesVencidas] = useState(null);
  const [empleadosStaff, setEmpleadosStaff] = useState([]);
  const [empleadoElegido, setEmpleadoElegido] = useState(null); 
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
  // eslint-disable-next-line no-unused-vars
  const [fechaElegida, setFechaElegida] = useState(lastDayOfPreviousMonth);
  useEffect(() => {
    const fetchInfoVacaciones = async () => {
      try {
        //   const MesEnviar = dayjs(solicitud.fecFinal).subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        //   console.log("**** , ", MesEnviar)

        const MesEnviar = fechaElegida;

        const response = await axios.post(
          "/obtenerInfoVacaciones", // URL de la API
          {
            idEmpleado: idEmpleado, // Datos en el cuerpo de la solicitud
            fecMes: MesEnviar,
          },
          {
            withCredentials: true, // Opción para incluir credenciales
          }
        );
        console.log("---", response.data.data);

        console.log("llego de data: ", response.data.data[0]);
        setSaldoVacaciones(
          response.data.data[0].Truncas +
            response.data.data[0].Pendientes +
            response.data.data[0].Vencidas
        );
        setVacacionesTruncas(response.data.data[0].Truncas);
        setVacacionesPendientes(response.data.data[0].Pendientes);
        setVacacionesVencidas(response.data.data[0].Vencidas);
      } catch (error) {
        console.error("Error fetching info vacaciones:", error);
      }
    };

    fetchInfoVacaciones();
  }, []);

    const obtenerEmpleadosStaff = async () => {
      try {
        const response = await listarEmpleadosStaffRequest();
        setEmpleadosStaff(response.data); // Actualiza el estado con los datos recibidos
      } catch (error) {
        console.error("Hubo un error al obtener los empleados del Staff", error);
      }
    };
  
    useEffect(() => {
      obtenerEmpleadosStaff();
    }, []);


    // Filtra el empleado específico cuando cambie el array de empleadosStaff o idEmpleado
    useEffect(() => {
        if (empleadosStaff.length > 0 && idEmpleado) {
          const empleado = empleadosStaff.find(
            (emp) => emp.idEmpleado[0] === parseInt(idEmpleado) // Ajusta según el formato de idEmpleado
          );
          setEmpleadoElegido(empleado || null);
        }
      }, [empleadosStaff, idEmpleado]);
    
  return (
    <div className=" w-full h-full">
    <div className="w-full text-xl font-bold bg-blue-950 text-white pt-2 pb-2 flex items-center justify-center">
  {empleadoElegido ? empleadoElegido.nombreCompleto : <>Cargando</>}
</div>
      <div className="flex w-full justify-between pl-10 pr-10 mt-5 ">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              className="flex gap-5 items-center"
              title="Saldo de dias de vacaciones"
              value={saldoVacaciones || 0}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              className="flex gap-5 items-center"
              title="Vacaciones Truncas"
              value={vacacionestruncas || 0}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              className="flex gap-5 items-center"
              title="Vacaciones Pendientes"
              value={vacacionesPendientes || 0}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              className="flex gap-5 items-center"
              title="Vacaciones Vencidas"
              value={vacacionesVencidas || 0}
            />
          </Col>
        </Row>
      </div>
      <div className="mt-5">
        <label className="font-bold text-xl pl-5"> Datos del Empleado</label>
       
      </div>
     <div className=" flex  items-center justify-center gap-20">
     <div className=" w-1/2 mt-5  pt-4 pb-4">
       
       {empleadoElegido ? (
         <div className="pl-16 mt-3 flex  flex-col gap-2">
           <p><b>Nombre:</b> {empleadoElegido.nombres}</p>
           <p><b>Departamento:</b> {empleadoElegido.apellidos}</p>
           <p><b>Documento:</b> {empleadoElegido.documento}</p>
           <p><b>Fecha Ingreso:</b> {empleadoElegido.fecInicioGestion}</p>
           <p><b>Fecha de nacimiento:</b> {empleadoElegido.fecNacimiento}</p>
           <p><b>Sexo:</b> {empleadoElegido.sexo}</p>
           <p><b>Estado civil :</b> {empleadoElegido.estadoCivil}</p>
           <p><b>Número de hijos :</b> {empleadoElegido.nroHijos}</p>
           <p><b>Correo :</b> {empleadoElegido.correo}</p>
           <p><b>Cargo :</b> {empleadoElegido.descripcion}</p>
           <p><b>Área :</b> {empleadoElegido.nombreArea}</p>
           
           {/* Agrega aquí más información del empleadoElegido según lo necesites */}
         </div>
       ) : (
         <p className="pl-5 mt-3">Cargando información del empleado...</p>
       )}
     </div> 
     <div className=" w-1/2 mt-5  pt-4 pb-4 flex justify-center">
     <div className="w-72 h-72 bg-gray-400 flex items-center justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/6522/6522581.png"
        alt="Ejemplo"
        className="w-full h-full object-contain"
      />
    </div>
     </div>
     </div>
    </div>
  );
};
export default DetalleEmpleado;
