import { useEffect, useState } from "react";
import { Descriptions, Spin, Tag, Button, Modal, Select, message } from "antd";
import axios from "../../API/axios.js";
import { Col, Row, Statistic } from "antd";
import { useAuth } from "../../contexts/AuthContext";

const { Option } = Select;

export const VerSolicitudVacaciones = () => {
  const { idSolVac, user } = useAuth();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState("");
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [selectedEstado2, setSelectedEstado2] = useState("");
  const [saldoVacaciones, setSaldoVacaciones] = useState(null); // Estado para almacenar el saldo de vacaciones

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await axios.get(
          `/obtenerSolicitudVacaciones/${idSolVac}`,
          { withCredentials: true }
        );
        console.log(response.data.data);
        setSolicitud(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [idSolVac]);

  // Nuevo useEffect que se ejecuta cuando `solicitud` ha sido cargada
  useEffect(() => {
    if (solicitud != null) {
      const fetchSaldoVacaciones = async () => {
        try {
          console.log("mi solicitud es: ", solicitud);
          console.log("idemp:", solicitud.idEmpleado);
          console.log("codMes:", solicitud.codMes);
          const response = await axios.get("/obtenerSaldoVacacionesEmpleado", {
            params: {
              idEmpleado: solicitud.idEmpleado,
              fecMes: solicitud.codMes,
            },
            withCredentials: true,
          });

          console.log("llego de data: ", response.data.data[0].saldoVacaciones);

          setSaldoVacaciones(response.data.data[0].saldoVacaciones); // Almacena el saldo de vacaciones
          console.log("saldo Vacaciones ", saldoVacaciones);
        } catch (error) {
          console.error("Error fetching saldo:", error);
        }
      };

      fetchSaldoVacaciones(); // Llama a la función para obtener el saldo
    }
  }, [solicitud]);

  const formatFecha = (fecha) => {
    return fecha ? fecha.slice(0, 10) : "";
  };

  const renderEstadoTag = (estado) => {
    let color = "default";
    if (estado === "PENDIENTE") {
      color = "blue";
    } else if (estado === "APROBADO") {
      color = "green";
    } else if (estado === "ADMITIDO") {
      color = "yellow";
    } else {
      color = "red";
    }
    return (
      <Tag color={color} style={{ fontWeight: "bold" }}>
        {estado}
      </Tag>
    );
  };

  const handleClick = () => {
    if (user.user.id_cargo === 9) {
      setIsModalVisible2(true);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const handleConfirm = async () => {
    
      const response = await axios.put(
        "/cambiarEstadoSolicitudVacaciones",
        {
          id: idSolVac,
          estado: selectedEstado,
        },
        { withCredentials: true }
      );
      console.log("ME LLEGA DEL RESPONSE: ",response);
     
  };

  const handleConfirm2 = async () => {
    try {
      // Primer endpoint para actualizar el estado
      const responseUpdate = await axios.put(
        "/cambiarEstadosolicitudVacacionesAprobada",
        {
          id: idSolVac,
          estado: selectedEstado2,
        },
        { withCredentials: true }
      );

      console.log(responseUpdate);
      console.log("El estado enviado es = ", selectedEstado2);

      // Verifica si el estado fue aprobado para proceder con el insert
      if (responseUpdate && selectedEstado2 === "APROBADO") {
        // Segundo endpoint para insertar en la tabla de vacaciones
        const responseInsert = await axios.post(
          "/createSolicitudAprobadaGerencia",
          {
            id: idSolVac,
            estado: selectedEstado2,
            // Agrega aquí los demás campos que necesites enviar
          },
          { withCredentials: true }
        );

        console.log("response del insert: ", responseInsert);

        if (responseInsert.status === 200) {
          message.success(
            "Estado actualizado e inserción realizada correctamente"
          );
          setSolicitud({ ...solicitud, estado: selectedEstado2 });
        } else {
          message.error({ content: "Hubo un error al realizar la inserción" });
        }
      }

      // Oculta el modal después de la operación
      setIsModalVisible2(false);
    } catch (error) {
      console.error("Error:", error);
      message.error({
        content:
          "Hubo un error al actualizar el estado o realizar la inserción",
      });
      setIsModalVisible2(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="pl-10 pr-10 flex flex-col gap-5">
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Saldo de dias de vacaciones"
              value={saldoVacaciones || 0}
            />
          </Col>
        </Row>
      </div>

      <Descriptions
        title={
          <span style={{ fontSize: "22px", fontWeight: "bold" }}>
            Detalles de la Solicitud
          </span>
        }
        bordered
      >
        <Descriptions.Item label="Empleado">
          {solicitud.usrInsert}
        </Descriptions.Item>
        <Descriptions.Item label="Mes">{solicitud.codMes}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Solicitud">
          {formatFecha(solicitud.fecSolicitud)}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Inicio">
          {formatFecha(solicitud.fecInicial)}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha Final">
          {formatFecha(solicitud.fecFinal)}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          {renderEstadoTag(solicitud.estadoVacaciones || solicitud.estado)}
        </Descriptions.Item>
        <Descriptions.Item label="Cantidad de Días">
          {solicitud.cantDias}
        </Descriptions.Item>
        <Descriptions.Item label="Cantidad de Días Habiles">
          {solicitud.cantDiasHabiles}
        </Descriptions.Item>
        <Descriptions.Item label="Cantidad de Días NO Habiles">
          {solicitud.cantDiasNoHabiles}
        </Descriptions.Item>
        <Descriptions.Item label="Detalle">
          {solicitud.detalle}
        </Descriptions.Item>
      </Descriptions>

      <div className="mt-5 flex items-center justify-center">
        <Button type="primary" onClick={handleClick}>
          Modificar
        </Button>
      </div>

      <Modal
        title="Modificar Estado de Solicitud - GERENCIA"
        visible={isModalVisible2}
        onCancel={handleCancel2}
        onOk={handleConfirm2}
      >
        <Select
          placeholder="Selecciona un estado"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedEstado2(value)}
        >
          <Option value="APROBADO">APROBADO</Option>
          <Option value="RECHAZADO">RECHAZADO</Option>
        </Select>
      </Modal>

      <Modal
        title="Modificar Estado de Solicitud - JEFE AREA"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleConfirm}
      >
        <Select
          placeholder="Selecciona un estado"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedEstado(value)}
        >
          <Option value="APROBADO">APROBADO</Option>
          <Option value="RECHAZADO">RECHAZADO</Option>
        </Select>
      </Modal>
    </div>
  );
};
