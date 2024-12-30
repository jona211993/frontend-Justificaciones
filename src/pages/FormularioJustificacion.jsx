import { useState, useEffect} from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Select, Space, Modal, Input, InputNumber, DatePicker } from "antd";
import "../styles/formulario.css";
import { asesoresBySuperRequest, grupoByIdRequest } from '../API/justificaciones';
import axios from "axios";
import 'animate.css';
import moment from 'moment';
import {useNavigate } from "react-router-dom";


const API= import.meta.env.VITE_BACKEND_URL

const { Option } = Select;
const provinceData = ["FALTA", "TARDANZA", "PERMISO"];
const cityData = {
  FALTA: ["FALTA_JUSTIFICADA", "FALTA_INJUSTIFICADA"],
  TARDANZA: ["TARDANZA_JUSTIFICADA"],
  PERMISO: ["PERMISO_JUSTIFICADO", "PERMISO_INJUSTIFICADO"],
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

  PERMISO_INJUSTIFICADO: [ 
    "OTRO- colocar el motivo en observación "
  
  ],
};

export const FormularioJustificacion = () => {

  const [form] = Form.useForm();
  const { user } = useAuth();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedNivel3, setSelectedNivel3] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [asesores, setAsesores] = useState([]);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [grupo, setGrupo] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [minutosPermiso, setMinutosPermiso] = useState(0);
  const navigate = useNavigate();
  //Fecha para bloquear que suban justificaciones pasadas
  const fechaLimite = moment('2024-12-14');

  const { TextArea } = Input;
 

  const obtenerGrupo = async () => {
    try {
      const response = await grupoByIdRequest(user.user.id_grupo);
      setGrupo(response.data[0].nombre);
    } catch (error) {
      console.error('Hubo un error al obt ener grupo', error);
    }
  };

  const obtenerAsesores = async () => {
    try {
      const response = await asesoresBySuperRequest(grupo);
      setAsesores(response.data);
    } catch (error) {
      console.error('Hubo un error al obtener los asesores:', error);
    }
  };

  const obtenerIdAsesorElegido = (nombre) => {
    const asesorElegido = asesores.find(asesor => asesor.usuario === nombre);
    return asesorElegido ? asesorElegido.id : null;
  };

  useEffect(() => {
    obtenerGrupo();
  }, []);

  useEffect(() => {
    if (grupo) {
      obtenerAsesores();
    }
  }, [grupo]);

  const handleAsesorChange = (value) => {
    setAsesorSeleccionado(value);
  };

  const handleObservacionChange = (e) => {
    setObservacion(e.target.value);
  };

  const handleFechaChange = (date, dateString) => {
    setFecha(dateString);
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedCity(null);
    setSelectedNivel3(null);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSelectedNivel3(null);
  };

  const handleNivel3Change = (value) => {
    setSelectedNivel3(value);
  };

  const handleChange = (value) => {
    setMinutosPermiso(value);
  };

  const handleSubmit = async () => {
    if (!selectedProvince || !selectedCity || !selectedNivel3 || !observacion || !asesorSeleccionado || !fecha || (selectedProvince === 'PERMISO' && minutosPermiso === 0)) {
      Modal.warning({
        title: 'Faltan Datos',
        content: 'Por favor, complete todos los campos del formulario.',
        duration: 2,
      });
      return;
    }

    try {
      let idEmpleado = obtenerIdAsesorElegido(asesorSeleccionado);

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

      const response = await axios.post(`${API}/crearJustificacion`, formData);
      console.log("Respuesta del servidor:", response.data);

      if (response.status === 200) {
        Modal.success({
          title: 'Éxito',
          content: 'Se registró con éxito.',
          onOk: () => {
            setSelectedCity("");
            setSelectedNivel3("");
            setSelectedProvince("");
            setFecha(null);
            form.resetFields(); // Restablecer los campos del formulario
            navigate('/expertisRH/justificaciones'); 
          },
        });

        navigate('/expertisRH/justificaciones');
      } else {
        Modal.error({
          title: 'Error',
          content: 'Algo salió mal, inténtelo de nuevo.',
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Modal.error({
        title: 'Error',
        content: 'Algo salió mal, inténtelo de nuevo.',
      });
    }
  };

  // para bloquear fecha
  const disabledDate = (current) => {
    // No permitir seleccionar fechas anteriores a la fecha límite
    return current && current < fechaLimite;
  }
  return (
    <div className="h-full md:w-full animate__animated animate__fadeInDown ">
    <Form
    form={form} // Pasa el objeto form al componente Form
      initialValues={{
        nivel1: selectedProvince,
        nivel2: selectedCity,
        nivel3: selectedNivel3,
      }}
      
    >
      <div className="text-xl text-center font-bold font-roboto p-3 md:text-5xl md:text-center">
        <h1 style={{color: '#053B50'}}>Formulario de Justificaciones </h1>
      </div>
      <div className="flex flex-wrap overflow-y-scroll h-screen  gap-5 items-center justify-center md:w-full ">
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
        <div className="flex flex-col font-semibold gap-2 text-sm ml-7 md:text-xl md:flex-row md:gap-x-72">
          <div className="w-3/4">
            <h2>Fecha: </h2>
            <Form.Item>
              <DatePicker
                format="YYYY-MM-DD"
                onChange={handleFechaChange}
                style={{ width: '100%' }}
                value={fecha ? moment(fecha, "YYYY-MM-DD") : null}
                disabledDate={disabledDate}
                inputReadOnly={true}  // Deshabilitar entrada manual
              />
            </Form.Item>
          </div>
          {selectedProvince === "PERMISO" && (
            <div className="w-2/3">
              <h2>Minutos de Permiso</h2>
              <Form.Item>
                <InputNumber min={0} onChange={handleChange} value={minutosPermiso} />
              </Form.Item>
            </div>
          )}
        </div>

        <div className="flex w-full justify-center items-center md:w-5/6">
          <Space
            direction="horizontal"
            style={{
              width: "100%",
              justifyContent: "space-around",
              flexWrap: "wrap"
            }}
          >
            <div>
              <h3>Nivel 1</h3>
              <Form.Item name="nivel1">
                <Select
                 name="nivel1"
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
                  name="nivel2"
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
            <div>
              <h3>Nivel 3</h3>
              <Form.Item name="nivel3">
                <Select
                  name="nivel3"
                  placeholder="Seleccione una opción de nivel 3"
                  onChange={handleNivel3Change}
                  value={selectedNivel3}
                  disabled={!selectedCity}
                >
                  {nivel3Data[selectedCity]?.map((nivel3Option) => (
                    <Option key={nivel3Option} value={nivel3Option} name="nivel3">
                      {nivel3Option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Space>
        </div>

        <div className="w-full flex items-center justify-center flex-col">
          <div className="font-semibold w-full m-2 md:w-5/6 md:text-xl">
            <h2>Observacion</h2>
            <Form.Item name="observacion">
              <TextArea
               name="observacion"
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
        <br />
        <br />
        <br />
      </div>
    </Form>
    <br />
    <br />
    <br />

    </div>
      );
};
