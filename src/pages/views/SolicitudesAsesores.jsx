/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Select,  Button, Table, message} from "antd";

import "../../styles/formulario.css";
import {
  asesoresBySuperRequest,
  grupoByIdRequest,
  idEmpleadoByAlias,
} from "../../API/justificaciones.js";

// import axios from "axios";
import "animate.css";
// import moment from 'moment';
// import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/es";

dayjs.extend(isSameOrBefore);
dayjs.locale("es");
dayjs.extend(utc);

const { Option } = Select;


const SolicitudesAsesores = () => {
   const [form] = Form.useForm();
    const { user } = useAuth();
    const [asesores, setAsesores] = useState([]);
    const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
    const [idEmpleadoAsesorSeleccionado, setIdEmpleadoAsesorSeleccionado] =   useState(null);
    const [grupo, setGrupo] = useState(null);  
    const [vacationData, setVacationData] = useState([]); // Estado para los datos de vacaciones
    const [loading, setLoading] = useState(false); // Estado para el indicador de carga
    // // Fecha actual y codMes
    // const fechaSistema = dayjs().format("YYYY-MM-DD");
    // const codMes = dayjs().startOf("month").format("YYYY-MM-DD");
  
    //  console.log("Fecha del sistema:", fechaSistema);
    //  console.log("CodMes:", codMes);    
  
   
  
    // const navigate = useNavigate();
    //Fecha para bloquear que suban justificaciones pasadas
  
    const obtenerGrupo = async () => {
      try {
        const response = await grupoByIdRequest(user.user.id_grupo);
        setGrupo(response.data[0].nombre);
      } catch (error) {
        console.error("Hubo un error al obt ener grupo", error);
      }
    };
  
    const obtenerAsesores = async () => {
      try {
        const response = await asesoresBySuperRequest(grupo);
        setAsesores(response.data);
      } catch (error) {
        console.error("Hubo un error al obtener los asesores:", error);
      }
    };
  
    const obtenerIdEmpleadoAsesor = async () => {
      try {
        const response = await idEmpleadoByAlias(asesorSeleccionado);
        console.log(response.data[0].idEmpleado);
        setIdEmpleadoAsesorSeleccionado(response.data[0].idEmpleado);
      } catch (error) {
        console.error(
          "Hubo un error al obtener el idEmpleado de Administrativo:",
          error
        );
      }
    };
  
    useEffect(() => {
      obtenerGrupo();
    }, []);
  
    useEffect(() => {
      if (grupo) {
        obtenerAsesores();
      }
    }, [grupo]);
  
    useEffect(() => {
      if (asesorSeleccionado) {
        console.log("Ahorita idEmpleado es:", asesorSeleccionado);
        obtenerIdEmpleadoAsesor();
        console.log("Ahorita idEmpleado es:", idEmpleadoAsesorSeleccionado);
      }
    }, [asesorSeleccionado]);
  
    const handleAsesorChange = (value) => {
      setAsesorSeleccionado(value);
    };

    const fetchVacationData = async () => {
      if (!asesorSeleccionado) {
        message.warning("Por favor selecciona un empleado antes de buscar.");
        return;
      }
  
      setLoading(true);
      try {
        setLoading(true); // Asegúrate de manejar el estado de carga al inicio
        const response = await fetch(`${API}/obtenerVacacionesAsesor`, {
          method: "POST", // Usa POST o el método que espera tu API
          headers: {
            "Content-Type": "application/json", // Asegúrate de que la cabecera sea JSON
          },
          body: JSON.stringify({ idEmpleado: idEmpleadoAsesorSeleccionado }), // Envía el campo idEmpleado en el cuerpo
        });
      
        if (!response.ok) {
          setVacationData([])
          throw new Error("Error en la solicitud al servidor");
          
        }
      
        const data = await response.json();
        console.log(data.data)
        setVacationData(data.data); // Maneja los datos devueltos
        message.success("Datos cargados correctamente");
      } catch (error) {
        message.error("Error al querer obtener los datos");
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };


    // Configuración de las columnas de la tabla
  const columns = [
    {
      title: "Mes",
      dataIndex: "codMes", // Nombre del atributo en el objeto
      key: "codMes",
      render: (text) => dayjs.utc(text).format("YYYY-MM-DD"), // Interpretar en UTC
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "fecInicial", // Nombre del atributo en el objeto
      key: "fechaInicio",
      render: (text) => dayjs.utc(text).format("YYYY-MM-DD"), // Interpretar en UTC
    },
    {
      title: "Fecha Final",
      dataIndex: "fecFinal",
      key: "fechaFinal",
      render: (text) => dayjs.utc(text).format("YYYY-MM-DD"), // Interpretar en UTC
    },
    {
      title: "Días Tomados",
      dataIndex: "cantDias",
      key: "diasTomados",
    },
    {
      title: "Dias H",
      dataIndex: "cantDiasHabiles",
      key: "DH",
    },
    {
      title: "Dias NH",
      dataIndex: "cantDiasNoHabiles",
      key: "DNH",
    },
    {
      title: "Estado",
      dataIndex: "estadoVacaciones",
      key: "estado",
    },
    {
      title: "Fecha Solicitud",
      dataIndex: "fecSolicitud",
      key: "fecSolicitud",
      render: (text) => dayjs.utc(text).format("YYYY-MM-DD"), // Interpretar en UTC
    },
  ];
  
  
  
  return (
    <div className="h-full md:w-full animate__animated animate__fadeInDown  ">
      <Form
        form={form} // Pasa el objeto form al componente Form
      >
        <div className="text-xl text-center font-bold font-roboto p-3 md:text-5xl md:text-center">
          <h1 style={{ color: "#053B50" }}>Histórico de Vacaciones  - Asesores </h1>
        </div>
        <div className="flex flex-col mt-10 overflow-y-scroll h-screen items-center gap-1  w-full ">
          <div className="mt-3 gap-5  w-full  font-semibold md:text-xl md:w-3/4  flex">
            <h2>Asesor</h2>
            <div className="w-full">
            <Form.Item name="asesor">
              <Select 
                
                showSearch
                placeholder="Seleccione un asesor"
                value={asesorSeleccionado}
                onChange={handleAsesorChange}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                 
                }
              >
                {asesores.map((asesor) => (
                  <Option key={asesor.id} value={asesor.usuario}>
                    {asesor.usuario}
                  </Option>
                ))}
              </Select>              
            </Form.Item>
            </div>
           
          </div>
          <div className="w-full flex items-center justify-center mb-5">
            <Button type="primary" onClick={fetchVacationData}>Buscar</Button>
          </div>
          {vacationData.length>0 ? (
               <Table
               columns={columns}
               dataSource={vacationData}
               loading={loading}
               rowKey={(record) => record.idVacacionesSolicitudes} // Usa un identificador único para cada fila
             />

          ) :<></>

          }
        </div>
      </Form>     
       
     
    </div>
  )
}

export default SolicitudesAsesores