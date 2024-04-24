import { useState } from "react";
import { Form, Select, Space} from "antd";
import { Input } from "antd";
import { InputNumber } from "antd";
import { DatePicker } from "antd";
import "../styles/formulario.css";
import axios from "axios";
import Nav from "../components/Nav";

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
    "Colaborador tiene una emergencia medica o familiar "  
  ],
};

const FormularioJustificacion = () => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedNivel3, setSelectedNivel3] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [asesor, setAsesor] = useState("");
  const [grupo, setGrupo] = useState("");
  const [fecha, setFecha] = useState("");
  const [minutosPermiso, setMinutosPermiso] = useState(0); // Estado para almacenar los minutos de permiso

  const handleObservacionChange = (e) => {
    setObservacion(e.target.value);
  };

  const handleAsesorChange = (e) => {
    setAsesor(e.target.value);
  };

  const handleGrupoChange = (value) => {
    setGrupo(value);
  };

  const handleFechaChange = (date, dateString) => {
    setFecha(dateString);
    console.log(dateString)
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
      // Aquí puedes incluir la lógica para enviar los datos del formulario y las imágenes al servidor
      const formData = {
        nivel1: selectedProvince,
        nivel2: selectedCity,
        nivel3: selectedNivel3,       
        observacion:observacion,
        asesor:asesor,
        grupo:grupo,
        fecha: fecha,
        minutos_permiso:minutosPermiso,
      };

      const response = await axios.post(
        "http://localhost:3000/crearJustificacion",
        formData
      );
      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
    <Nav></Nav>
    <Form
      initialValues={{
        nivel1: selectedProvince,
        nivel2: selectedCity,
        nivel3: selectedNivel3,
      }}
      style={
        {width: "100%" }
      }
    >
      <div className="titulo">
        <h1>FORMULARIO DE JUSTIFICACIONES </h1>
      </div>
      <div>
        
      <div className="cont-logo" >    
        <div className="logo">
        </div>   
      </div>
      </div>
      <div className="cont-asesor-grupo">
        <div className="asesor">
          <h2>Asesor</h2>
          <Form.Item name="asesor">
            <Input
              placeholder="Nombre del asesor"
              value={asesor}
              onChange={handleAsesorChange}
            />
          </Form.Item>
        </div>
        <div className="grupo">
          <h2>Grupo</h2>
          <Form.Item name="grupo">
            <Select
              style={{
                width: 120,
              }}
              onChange={handleGrupoChange}
              value={grupo}
              options={[
                {
                  value: "JORDAN",
                  label: "JORDAN",
                },
                {
                  value: "JORGE",
                  label: "JORGE",
                },
                {
                  value: "KENNETH",
                  label: "KENNETH",
                },
                {
                  value: "MELINA",
                  label: "MELINA",
                },

                {
                  value: "MELITA",
                  label: "MELITA",
                },
                {
                  value: "LUIS",
                  label: "LUIS",
                },
              ]}
            />
          </Form.Item>
        </div>
      </div>
      <div className="niveles">
        <Space
          direction="vertical"
          style={{
            marginTop: 0,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between"
          }}
        >
          <div className="selec-nivel">
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
          <div className="selec-nivel">
            <h3>Nivel 3</h3>
            <Form.Item name="nivel3">
              <Select
                placeholder="Seleccione una opción de nivel 3"
                onChange={handleNivel3Change}
                value={selectedNivel3}
                style={{ width: 350 }}
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
      <div className="cont-1">
        <div className="cont-calendario">
          <h2>Fecha: </h2>
          <Form.Item>
            <div>
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="Selecciona una fecha"
                onChange={handleFechaChange}
              />
            </div>
          </Form.Item>
        </div>

        <div>
          <h2>Minutos de permiso</h2>
          <Form.Item>
            <InputNumber
              min={0}
              max={1000}
              defaultValue={minutosPermiso}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </div>

      <div className="cont-observacion">
        <h2>Observacion</h2>
        <Form.Item name="observacion">
          <Input
            placeholder="Ingresa la observacion"
            value={observacion}
            onChange={handleObservacionChange}
          />
        </Form.Item>
      </div>
     <div className="cont-boton">
     <button className="boton" onClick={handleSubmit}>Enviar</button>
     </div>
    
    </Form>
    <footer>
    JP
    </footer>
    </>
    
  );
};

export default FormularioJustificacion;
