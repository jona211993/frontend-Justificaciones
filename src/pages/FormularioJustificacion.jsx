import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Select, Space } from "antd";
import { Input } from "antd";
import { InputNumber } from "antd";
import { DatePicker } from "antd";
import "../styles/formulario.css";
import { asesoresBySuperRequest, grupoByIdRequest } from '../API/justificaciones';
import axios from "axios";

const { Option } = Select;
const provinceData = ["FALTA", "TARDANZA", "PERMISO"];
const cityData = {
  FALTA: ["FALTA_JUSTIFICADA", "FALTA_INJUSTIFICADA"],
  TARDANZA: ["TARDANZA_JUSTIFICADA"],
  PERMISO: ["PERMISO_JUSTIFICADO"],
};
const nivel3Data = {
  FALTA_JUSTIFICADA: [
    "LICENCIA CON GH- CERTIFICADO DE INCAPACIDAD (DM mayor a 21 dias)",
    "LICENCIA CON GH- VARIAS",
    "LICENCIAS SIN GH",
    "MATERNIDAD (PRE Y POST)",
    "DESCANSO MEDICO",
  ],
  FALTA_INJUSTIFICADA: [
    "Presenta documentos de denuncias por el día que faltó.",
    "Presenta documentación de atención médica (Boleta comprade medicamentos y receta medica) pero no cuenta con DM  (UNA VEZ AL MES)",
    "Presenta documentación de atención medica de familiar dependiente.",
    "Exámenes, trámites estudiantiles presentando pruebas (cronograma de exámenes, documentos con el sello de la U o Instituto)",
    "OTRO- colocar el motivo en observación",
  ],
  TARDANZA_JUSTIFICADA: [
    "Inconvenientes con las herramientas de trabajo- Se debe evidenciar que el supervisor lo  a TI ",
    "No tiene usuario o presentó problemas con su usuario",
    "Primer día laborando (En observación colocar fecha de ingreso)",
    "Problemas femeninos y/o problemas de salud al iniciar sus labores",
    "OTRO- colocar el motivo en observación ",
    "Problemas familiares presentando pruebas (conversaciones por WhatsApp, llamadas grabadas, confirmación de vulnerabilidad del colaborador)",
    "Colaborador tiene cita médica -muestra evidencias ",
    "Exámenes, trámites estudiantiles presentando pruebas (cronograma de exámenes, documentos con el sello de la U o Instituto)",
    "Presenta documentación de atención medica de familiar dependiente. ",
    "Tiene tres a + motivos de tardanza justificada sin descuento",
  ],

  PERMISO_JUSTIFICADO: [
    "Colaborador tiene cita médica -muestra evidencias ",
    "Problemas femeninos y/o problemas de salud durante sus labores",
    "OTRO- colocar el motivo en observación ",
    "Colaborador se retira antes de tiempo porque decidió renunciar",
    "Tiene tres a + motivos de permiso",
    "Colaborador tiene una emergencia medica o familiar ",
  ],
};

export const FormularioJustificacion = () => {
  const {user}= useAuth();
//  console.log("Tenemos los datos del user aqui:");
  // console.log(user.user.id_grupo);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedNivel3, setSelectedNivel3] = useState(null);
  const [observacion, setObservacion] = useState("");
 // Estado para almacenar los datos de los asesores
 const [asesores, setAsesores] = useState([]);
 // Estado para almacenar el valor del asesor seleccionado
 const [asesorSeleccionado, setAsesorSeleccionado] = useState();
   const [grupo, setGrupo] = useState();
  const [fecha, setFecha] = useState("");
  const [minutosPermiso, setMinutosPermiso] = useState(0); // Estado para almacenar los minutos de permiso

  const { TextArea } = Input;
  const obtenerGrupo = async () => {
    try {
      const response = await grupoByIdRequest(user.user.id_grupo); // Envía el grupo deseado    
      setGrupo(response.data[0].nombre); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Hubo un error al obtener grupo', error);
    }
  };
 // Función para obtener los datos de los asesores
 const obtenerAsesores = async () => {
  try {
    console.log("Valor de grupo:", grupo); 
    const response = await asesoresBySuperRequest(grupo); // Envía el grupo deseado
    setAsesores(response.data); // Actualiza el estado con los datos recibidos
  } catch (error) {
    console.error('Hubo un error al obtener los asesores:', error.name);
  }
};
 // Función para obtener el grupo del usuario logueado


//para obtener el id del asesor elegido:
const obtenerIdAsesorElegido= (nombre) => {
  const asesorElegido = asesores.find(asesor => asesor.usuario === nombre);  
  // Si se encuentra un asesor con ese nombre, devuelve su id
  if (asesorElegido) {
    console.log("Se obtuvo el id del empleado elegido que es: "+asesorElegido.id)
    return asesorElegido.id;
  } else {
    // Si no se encuentra ningún asesor con ese nombre, devuelve null o maneja el caso según tu necesidad
    return null;
  }
};

 // Llamada a la función para obtener los asesores al cargar el componente
 useEffect(() => {
   obtenerGrupo();   
}, []);
useEffect(() => {
  if (grupo !== "") { // O cualquier condición que indique que grupo está listo
     obtenerAsesores();
  }
}, [grupo]);
 // Función para manejar el cambio en el Select de asesores
 const handleAsesorChange = (value) => {
  console.log(value);
  setAsesorSeleccionado(value);
  
};
  const handleObservacionChange = (e) => {
    setObservacion(e.target.value);
  };


  const handleFechaChange = (date, dateString) => {
    setFecha(dateString);
    console.log(dateString);
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null); // Reset city when province changes
    setSelectedNivel3(null); // Reset nivel3 when province changes
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedNivel3(null); // Reset nivel3 when city changes
  };

  const handleNivel3Change = (value) => {
    setSelectedNivel3(value);
  };

  const handleChange = (value) => {
    setMinutosPermiso(value);
  };

  const handleSubmit = async () => {
    try {
    
      let idEmpleado= obtenerIdAsesorElegido(asesorSeleccionado)
      // Aquí puedes incluir la lógica para enviar los datos del formulario y las imágenes al servidor
      const formData = {
        nivel1: selectedProvince,
        nivel2: selectedCity,
        nivel3: selectedNivel3,
        observacion: observacion,
        asesor: asesorSeleccionado,
        id_empleado: idEmpleado,
        grupo: grupo,
        fecha: fecha,
        minutos_permiso: minutosPermiso,
      };

      console.log("se esta enviando en el body todo esto:"+formData.id_empleado)

      const response = await axios.post(
        "http://localhost:3000/api/crearJustificacion",
        formData
      );
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    
      <Form
        initialValues={{
          nivel1: selectedProvince,
          nivel2: selectedCity,
          nivel3: selectedNivel3,
        }}
        className=" w-full h-4/5 scroll-m-2 md:w-full"
      >
        <div className="text-xl  text-center font-bold font-roboto p-5  md:text-5xl md:text-center">
          <h1>Formulario de Justificaciones </h1>
        </div>
        <div className="flex flex-wrap gap-5 items-center justify-center md:w-full ">
            <div className="mt-3 w-full m-3 font-semibold md:text-xl md:w-3/4 h-16">
              <h2>Asesor</h2>
              <Form.Item name="asesor">
        <Select
          showSearch
          placeholder="Seleccione un asesor"
          value={asesorSeleccionado}
          onChange={handleAsesorChange}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {asesores.map(asesor => (
            <Option key={asesor.id} value={asesor.usuario}>
              {asesor.usuario}
            </Option>
          ))}
        </Select>
      </Form.Item>
            </div>
            <div className=" flex flex-col font-semibold gap-2 text-sm ml-7 md:text-xl md:flex-row md:gap-x-72 ">
                <div className="">
                <h2>Fecha: </h2>
                  <Form.Item className="">
                    <DatePicker
                      format="YYYY-MM-DD"
                      placeholder="Selecciona una fecha"
                      onChange={handleFechaChange}                      
                    />
                  </Form.Item>
                </div>
                <div className="">
                  <h2>Minutos de permiso</h2>
                  <Form.Item>
                    <InputNumber
                      min={0}
                      max={600}
                      defaultValue={minutosPermiso}
                      onChange={handleChange}
                      disabled={selectedProvince !== 'PERMISO'}
                    />
                  </Form.Item>
                </div>
            </div>
            <div className="w-full m-1 flex flex-row p-3 font-semibold md:text-xl">
              <Space
                direction="vertical"
                className=" gap-4 w-full" 
                style={{
                  marginTop: 0,
                  display: "flex",
                  flexWrap: "wrap"                
                }}
              >
                <div className="">
                  <h3>Nivel 1</h3>
                  <Form.Item name="nivel1">
                    <Select
                      placeholder="Seleccione"
                      onChange={handleProvinceChange}
                      value={selectedProvince} 
                      style={{ width: 200 }}                    
                    >
                      {provinceData.map((province) => (
                        <Option key={province} value={province}>
                          {province}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="selec-nivel">
                  <h3>Nivel 2</h3>
                  <Form.Item name="nivel2">
                    <Select
                      placeholder="Elige"
                      onChange={handleCityChange}
                      value={selectedCity}
                      style={{ width: 200 }}
                      disabled={!selectedProvince}
                    >
                      {cityData[selectedProvince]?.map((city) => (
                        <Option key={city} value={city}>
                          {city}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="">
                  <h3>Nivel 3</h3>
                  <Form.Item name="nivel3">
                    <Select
                      placeholder="Seleccione una opción de nivel 3"
                      onChange={handleNivel3Change}
                      value={selectedNivel3}                      
                      disabled={!selectedCity}
                      
                    >
                      {nivel3Data[selectedCity]?.map((nivel3Option) => (
                        <Option key={nivel3Option} value={nivel3Option}>
                          {nivel3Option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Space>
            </div>

           <div className="w-full flex items-center justify-center flex-col">
           <div className=" font-semibold w-full m-2 md:w-5/6 md:text-xl">
              <h2>Observacion</h2>
              <Form.Item name="observacion">
                <TextArea
                  placeholder="Ingresa la observacion"
                  value={observacion}
                  onChange={handleObservacionChange}
                  rows={5}
                  maxLength={350}
                />
              </Form.Item>
            </div>
            <div className="cont-boton">
              <button className="boton" onClick={handleSubmit}>
                Enviar
              </button>              
            </div>
            <div>
             <br />
             <br />
            </div>
           </div>
        </div>
      </Form>
      
    
  );
};
