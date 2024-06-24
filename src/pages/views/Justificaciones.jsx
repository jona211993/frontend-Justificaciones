import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  listarJustificacionesRequest,
  justificacionesByIdGrupoRequest,
  eliminarJustificacionRequest
} from "../../API/justificaciones.js";
import { Table, Input, Button, Space, DatePicker } from "antd";
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

export const Justificaciones = () => {
  const [justificaciones, setJustificaciones] = useState([]);
  const { setIdJust, user } = useAuth();
  const [fechaInicio, setFechaInicio] = useState(null); // Estado para fecha de inicio
  const [fechaFin, setFechaFin] = useState(null); // Estado para fecha de fin

  const obtenerJustificaciones = async () => {
    try {
      console.log("El id_grupo de mi usuario es: " + user.user.id_grupo);
      console.log("El id_cargo de mi usuario es: " + user.user.id_cargo);
      const response = await justificacionesByIdGrupoRequest(user.user.id_grupo, user.user.id_cargo);
      setJustificaciones(response.data); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error("Hubo un error al obtener las justificaciones:", error);
    }
  };

  useEffect(() => {
    obtenerJustificaciones();
  }, []);

  const handleVer = (id) => {
    console.log("El id enviado es: " + id);
    setIdJust(id);
  };

  const handleEliminar = async (id) => {
    console.log("El ID enviado para eliminar es: " + id);
    setIdJust(id);
    try {
      const response = await eliminarJustificacionRequest(id);
      if (response.status === 200) {
        console.log("Justificación eliminada con éxito.");
        obtenerJustificaciones(); // Actualiza la lista después de eliminar
      } else {
        console.error("Error al eliminar la justificación:", response.statusText);
      }
    } catch (error) {
      console.error("Hubo un error al eliminar la justificación:", error);
    }
  };

  const handleCargarPruebas = (id) => {
    console.log("El id enviado para cargar pruebas es: " + id);
    setIdJust(id);
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      width: 150,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Space>
            <DatePicker.RangePicker
              value={[fechaInicio, fechaFin]}
              onChange={(dates) => {
                if (dates) {
                  setFechaInicio(dates[0]);
                  setFechaFin(dates[1]);
                  setSelectedKeys([`${dates[0].format("YYYY-MM-DD")},${dates[1].format("YYYY-MM-DD")}`]);
                } else {
                  setFechaInicio(null);
                  setFechaFin(null);
                  setSelectedKeys([]);
                }
              }}
              style={{ marginRight: 8 }}
            />
            <Button
              type="primary"
              onClick={confirm}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reiniciar
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        const fecha = moment(record.fecha, "YYYY-MM-DD");
        if (fechaInicio && fechaFin) {
          return fecha >= fechaInicio && fecha <= fechaFin;
        }
        return true;
      },
      render: (text) => {
        return <span>{text.slice(0, 10)}</span>;
      },
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
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
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
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
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
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
    },
    {
      title: "Grupo",
      width: 150,
      dataIndex: "grupo",
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

  // Condición para mostrar las columnas de editar y eliminar
  if (user.user.id_cargo !== 1 || user.user.id_grupo !== 1) {
    columns.push(
      {
        title: "Editar",
        width: 50,
        render: (record) => (
          <Button
            className="acciones-button"
            icon={<EditOutlined style={{ color: "green" }} />}
            onClick={() => handleEditar(record.id)}
          />
        ),
      },
      {
        title: "Eliminar",
        width: 50,
        render: (record) => (
          <Button
            className="acciones-button"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            onClick={() => handleEliminar(record.id)}
          />
        ),
      },
      {
        title: "Pruebas",
        width: 50,
        render: (record) => (
          <Link to="/expertisRH/cargaPruebas">
            <Button
              className="acciones-button"
              icon={<UploadOutlined style={{ color: "blue" }} />}
              onClick={() => handleCargarPruebas(record.id)}
            />
          </Link>
        ),
      }
    );
  }

  const data = justificaciones.map((justificacion, index) => {
    return { ...justificacion, key: index };
  });

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
          dataSource={data}
          scroll={{ x: 100 }}
          pagination={{ pageSize: 6 }}
          bordered
        />
      </div>
    </div>
  );
};

export default Justificaciones;
