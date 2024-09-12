import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import {
  listarJustificacionesRequest,
  justificacionesByIdGrupoRequest,
  eliminarJustificacionRequest,
  editarJustificacionRequest
} from "../../API/justificaciones.js";
import { Table, Input, Button, Space, DatePicker, Modal, Radio } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "../../styles/tabla.css";
import 'animate.css';
import moment from 'moment';

const Justificaciones = () => {
  const { setIdJust, user, filtrosJustificaciones, setFiltrosJustificaciones } = useAuth();
  const [justificaciones, setJustificaciones] = useState([]);
  const [filteredJustificaciones, setFilteredJustificaciones] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentJustificacion, setCurrentJustificacion] = useState(null);
  const [descuento, setDescuento] = useState("NO");
  const [penalidad, setPenalidad] = useState("NO");

  const obtenerJustificaciones = useCallback(async () => {
    try {
      const response = await justificacionesByIdGrupoRequest(user.user.id_grupo, user.user.id_cargo);
      setJustificaciones(response.data);
    } catch (error) {
      console.error("Hubo un error al obtener las justificaciones:", error);
    }
  }, [user.user.id_grupo, user.user.id_cargo]);

  useEffect(() => {
    obtenerJustificaciones();
  }, [obtenerJustificaciones]);

  useEffect(() => {
    const applyFilters = () => {
      let filteredData = [...justificaciones];
      
      if (filtrosJustificaciones.fechaInicio && filtrosJustificaciones.fechaFin) {
        filteredData = filteredData.filter(justificacion => {
          const fecha = moment(justificacion.fecha, "YYYY-MM-DD");
          return fecha.isBetween(filtrosJustificaciones.fechaInicio, filtrosJustificaciones.fechaFin, null, '[]');
        });
      }

      if (filtrosJustificaciones.asesor) {
        filteredData = filteredData.filter(justificacion =>
          justificacion.asesor.toLowerCase().includes(filtrosJustificaciones.asesor.toLowerCase())
        );
      }

      if (filtrosJustificaciones.grupo) {
        filteredData = filteredData.filter(justificacion =>
          justificacion.grupo.toLowerCase().includes(filtrosJustificaciones.grupo.toLowerCase())
        );
      }

      setFilteredJustificaciones(filteredData);
    };

    applyFilters();
  }, [justificaciones, filtrosJustificaciones]);

  const handleVer = (id) => {
    setIdJust(id);
  };

  const handleEliminar = async (id) => {
    setIdJust(id);
    try {
      const response = await eliminarJustificacionRequest(id);
      if (response.status === 200) {
        obtenerJustificaciones();
      } else {
        console.error("Error al eliminar la justificación:", response.statusText);
      }
    } catch (error) {
      console.error("Hubo un error al eliminar la justificación:", error);
    }
  };

  const handleCargarPruebas = (id) => {
    setIdJust(id);
  };

  const handleEditar = (id) => {
    setCurrentJustificacion(id);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const response = await editarJustificacionRequest(currentJustificacion, { descuento, penalidad });
      if (response.status === 200) {
        setIsModalVisible(false);
        obtenerJustificaciones();
      } else {
        console.error("Error al editar la justificación:", response.statusText);
      }
    } catch (error) {
      console.error("Hubo un error al editar la justificación:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      width: 150,
      // filterDropdown: ({
      //   setSelectedKeys,
      //   selectedKeys,
      //   confirm,
      //   clearFilters,
      // }) => (
      //   <div style={{ padding: 8 }}>
      //     <Space>
      //       <DatePicker.RangePicker
      //         value={[filtrosJustificaciones.fechaInicio, filtrosJustificaciones.fechaFin]}
      //         onChange={(dates) => {
      //           if (dates) {
      //             setFiltrosJustificaciones({ ...filtrosJustificaciones, fechaInicio: dates[0], fechaFin: dates[1] });
      //             setSelectedKeys([`${dates[0].format("YYYY-MM-DD")},${dates[1].format("YYYY-MM-DD")}`]);
      //           } else {
      //             setFiltrosJustificaciones({ ...filtrosJustificaciones, fechaInicio: null, fechaFin: null });
      //             setSelectedKeys([]);
      //           }
      //         }}
      //         style={{ marginRight: 8 }}
      //       />
      //       <Button
      //         type="primary"
      //         onClick={confirm}
      //         icon={<SearchOutlined />}
      //         size="small"
      //         style={{ width: 90 }}
      //       >
      //         Buscar
      //       </Button>
      //       <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
      //         Reiniciar
      //       </Button>
      //     </Space>
      //   </div>
      // ),
      onFilter: (value, record) => {
        const fecha = moment(record.fecha, "YYYY-MM-DD");
        if (filtrosJustificaciones.fechaInicio && filtrosJustificaciones.fechaFin) {
          return fecha.isBetween(filtrosJustificaciones.fechaInicio, filtrosJustificaciones.fechaFin, null, '[]');
        }
        return true;
      },
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Asesor",
      width: 150,
      dataIndex: "asesor",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar asesor"
            value={selectedKeys[0]}
            onChange={(e) => {
              setFiltrosJustificaciones({ ...filtrosJustificaciones, asesor: e.target.value });
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={() => {
          setFiltrosJustificaciones({ ...filtrosJustificaciones, asesor: "" });
          setSelectedKeys([]);
          clearFilters();
        }}
        size="small"
        style={{ width: 90 }}>
              Reiniciar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.asesor.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Grupo",
      width: 150,
      dataIndex: "grupo",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar grupo"
            value={selectedKeys[0]}
            onChange={(e) => {
              setFiltrosJustificaciones({ ...filtrosJustificaciones, grupo: e.target.value });
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={() => {
          setFiltrosJustificaciones({ ...filtrosJustificaciones, grupo: "" });
          setSelectedKeys([]);
          clearFilters();
        }}
        size="small"
        style={{ width: 90 }}>
              Reiniciar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.grupo.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Tipo",
      width: 150,
      dataIndex: "nivel1",
    },
    {
      title: "Ver",
      width: 50,
      render: (record) => (
        <Link to="/expertisRH/verJustificacion">
          <Button
            className="acciones-button"
            icon={<EyeOutlined style={{ color: "purple" }} />}
            onClick={() => handleVer(record.id)}
          />
        </Link>
      ),
    },
  ];

  if (user.user.id_cargo === 8) {
    columns.push({
      title: "Editar",
      width: 50,
      render: (record) => (
        <Button
          className="acciones-button"
          icon={<EditOutlined style={{ color: "green" }} />}
          onClick={() => handleEditar(record.id)}
        />
      ),
    });
  }
  if (user.user.id_cargo === 5 || user.user.id_cargo === 8) {
    columns.push({
      title: "Eliminar",
      width: 50,
      render: (record) => (
        <Button
          className="acciones-button"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={() => handleEliminar(record.id)}
        />
      ),
    });
  }
  if (user.user.id_cargo === 5 || user.user.id_cargo === 8) {
  columns.push({
    title: "Cargar Pruebas",
    width: 50,
    render: (record) => (
      <Button
        className="acciones-button"
        icon={<UploadOutlined style={{ color: "blue" }} />}
        onClick={() => handleCargarPruebas(record.id)}
      />
    ),
  });}

  return (
    <div className="flex flex-col gap-4 items-center justify-start h-screen  overflow-scroll animate__animated animate__fadeIn">
       <h2
        style={{ color: "#053B50" }}
        className="text-xl text-center font-bold font-roboto p-5 md:text-5xl md:text-center"
      >
        Lista de Justificaciones
      </h2>

      <div className="flex items-center justify-center w-11/12 h-screen">
      <Table
      className="custom-table"
        columns={columns}
        dataSource={filteredJustificaciones}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
      </div>
      <Modal
        title="Editar Justificación"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <div>
            <span>Descuento:</span>
            <Radio.Group value={descuento} onChange={(e) => setDescuento(e.target.value)}>
              <Radio value="SI">Sí</Radio>
              <Radio value="NO">No</Radio>
            </Radio.Group>
          </div>
          <div style={{ marginTop: 16 }}>
            <span>Penalidad:</span>
            <Radio.Group value={penalidad} onChange={(e) => setPenalidad(e.target.value)}>
              <Radio value="SI">Sí</Radio>
              <Radio value="NO">No</Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Justificaciones;
