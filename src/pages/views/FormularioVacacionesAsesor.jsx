/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect ,useRef} from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Select, DatePicker, Modal, Button, Result } from "antd";
import "../../styles/formulario.css";
import {
  asesoresBySuperRequest,
  grupoByIdRequest,
  idEmpleadoByAlias,
} from "../../API/justificaciones.js";
import { ConfigProvider } from "antd";
import axios from "axios";
import "animate.css";
// import moment from 'moment';
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URL;

import locale from "antd/locale/es_ES";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/es";

dayjs.extend(isSameOrBefore);
dayjs.locale("es");

const { RangePicker } = DatePicker;
const { Option } = Select;

const FormularioVacacionesAsesor = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [asesores, setAsesores] = useState([]);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [idEmpleadoAsesorSeleccionado, setIdEmpleadoAsesorSeleccionado] =
    useState(null);
  const [grupo, setGrupo] = useState(null);
  const [fechaInicial, setFechaInicial] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [diasTotales, setDiasTotales] = useState(0);
  const [diasHabiles, setDiasHabiles] = useState(0);
  const [diasNoHabiles, setDiasNoHabiles] = useState(0);
  const pickerRef = useRef(null); // Referencia al RangePicker

  // Fecha actual y codMes
  const fechaSistema = dayjs().format("YYYY-MM-DD");
  const codMes = dayjs().startOf("month").format("YYYY-MM-DD");

  //  console.log("Fecha del sistema:", fechaSistema);
  //  console.log("CodMes:", codMes);

  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const resetDates = () => {
    setAsesorSeleccionado("")
    if (pickerRef.current) {
      pickerRef.current.clear(); // Limpia el RangePicker
    }
  } 
  const disabledDate = (current) => {
    // Deshabilitar fechas anteriores al día de hoy
    return current && current < dayjs().startOf("day");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAsesorSeleccionado("")
    navigate('/expertisRH/registrarVacacionesAsesor'); 
    resetDates();
  };

  // Función para calcular días hábiles y no hábiles
  const calcularDias = (fechaInicio, fechaFin) => {
    const fechaInicioObj = dayjs(fechaInicio);
    const fechaFinObj = dayjs(fechaFin);
    let total = 0;
    let habiles = 0;
    let noHabiles = 0;

    let fechaActual = fechaInicioObj;
    while (fechaActual.isSameOrBefore(fechaFinObj, "day")) {
      total += 1;
      const diaSemana = fechaActual.day(); // 0 (Domingo) - 6 (Sábado)
      if (diaSemana === 0 || diaSemana === 6) {
        noHabiles += 1;
      } else {
        habiles += 1;
      }
      fechaActual = fechaActual.add(1, "day");
    }

    setDiasTotales(total);
    setDiasHabiles(habiles);
    setDiasNoHabiles(noHabiles);
  };

  // PARA EL CAMBIO  EN LA SELECCION DE FECHAS
  const onChange = (dates, dateStrings) => {
    if (dates) {
      setFechaInicial(dateStrings[0]);
      setFechaFinal(dateStrings[1]);
      calcularDias(dateStrings[0], dateStrings[1]);
    } else {
      setFechaInicial(null);
      setFechaFinal(null);
      setDiasTotales(0);
      setDiasHabiles(0);
      setDiasNoHabiles(0);
    }
  };

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

  const handleSubmit = async () => {
    if (!asesorSeleccionado) {
      Modal.warning({
        title: "Faltan Datos",
        content: "Por favor, complete todos los campos del formulario.",
        duration: 2,
      });
      return;
    }
    const formData = {
      id_empleado: idEmpleadoAsesorSeleccionado,
      codMes: codMes,
      fecSolicitud: fechaSistema,
      fechaInicial: fechaInicial,
      fechaFinal: fechaFinal,
      cantDias: diasTotales,
      estadoVacaciones: "APROBADO",
      tipoVacaciones: "REGISTRADAS Y GOZADAS",
      detalle: "CONTABLE",
      cantDiasHabiles: diasHabiles,
      cantDiasNoHabiles: diasNoHabiles,
      estado: "I",
      fecInsert: fechaSistema,
      usrInsert: user.user.usuario,
      // asesor: asesorSeleccionado,
    };
    console.log("Se enviara: ", formData);
     try {
        const response = await axios.post(`${API}/registrarVacacionesAsesor`, formData);
        console.log("Respuesta del servidor:", response.data);

        if (response.data.status === 200) {
          showModal();
         
          
        } else {
          console.log("UPPPSS")
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

  return (
    <div className="h-full md:w-full animate__animated animate__fadeInDown  ">
      <Form
        form={form} // Pasa el objeto form al componente Form
      >
        <div className="text-xl text-center font-bold font-roboto p-3 md:text-5xl md:text-center">
          <h1 style={{ color: "#053B50" }}>Registro de Vacaciones Asesor </h1>
        </div>
        <div className="flex flex-col mt-10 overflow-y-scroll h-screen items-center gap-5  md:w-full ">
          <div className="mt-3 gap-5  w-full m-3 font-semibold md:text-xl md:w-3/4  flex">
            <h2>Asesor</h2>
            <Form.Item name="asesor">
              <Select
                showSearch
                placeholder="Seleccione un asesor"
                value={asesorSeleccionado}
                onChange={handleAsesorChange}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {asesores.map((asesor) => (
                  <Option key={asesor.id} value={asesor.usuario}>
                    {asesor.usuario}
                  </Option>
                ))}
              </Select>
              <div className=" mt-5 ">
                <label>
                  {" "}
                  Supervisor Elija el rango de fechas de vacaciones para el
                  asesor:
                </label>
                <div>
                  <ConfigProvider locale={locale}>
                    <div style={{ padding: "20px" }}>
                      <RangePicker onChange={onChange}  ref={pickerRef}   disabledDate={disabledDate} />
                    </div>
                  </ConfigProvider>
                </div>
              </div>
            </Form.Item>
          </div>
          <div className="cont-boton  w-full">
            <Button onClick={handleSubmit}>Enviar</Button>
          </div>
        </div>
      </Form>
      <br />
      <br />
      <br />
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Esto elimina los botones predeterminados del modal
      >
        <Result
          status="success"
          title={`Registro de Vacaciones exitoso para el asesor ${asesorSeleccionado} `}
          
        />
      </Modal>
    </div>
  );
};

export default FormularioVacacionesAsesor;
