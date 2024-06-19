import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { listarJustificacionesRequest, justificacionesByIdGrupoRequest, eliminarJustificacionRequest} from "../../API/justificaciones.js";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "../../styles/tabla.css";
import 'animate.css';

export const Justificaciones = () => {
  const [justificaciones, setJustificaciones] = useState([]);
  const {  setIdJust , user} = useAuth();  
  const obtenerJustificaciones = async () => {
    try {

      console.log("el id_grupo de mi usuario es el :  "+user.user.id_grupo);
      console.log("el id_cargo de mi usuario es el :  "+user.user.id_cargo);
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
    console.log("el id enviado es: "+id)
    setIdJust(id)
  };

  const handleEliminar = async (id) => {
    console.log("El ID enviado es: " + id);
    setIdJust(id);
    try {
      console.log("El ID de justificación es: " + id);
      const response = await eliminarJustificacionRequest(id);
      if (response.status === 200) {       
        return response.data;
      } else {
        console.error("Error al eliminar la justificación:", response.statusText);
        // Maneja el caso en que el estado no sea 200
        return null;
      }
    } catch (error) {
      console.error("Hubo un error al eliminar la justificación:", error);
      // Puedes manejar el error aquí, como mostrar un mensaje de error al usuario
      return null;
    }

  };


  const handleCargarPruebas = (id) => {
    console.log("el id enviado  en prueba es: "+id)
    setIdJust(id)
  };

  const columns = [
    {
      title: "Fecha",
      width: 10,
      dataIndex: "fecha",
    },
    {
      title: "Asesor",
      width: 30,
      dataIndex: "asesor",
      // Filtro personalizado para la columna Asesor
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
      // Renderizar el icono del filtro en el encabezado de la columna
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      // Lógica de filtrado
      onFilter: (value, record) =>
        record.asesor.toLowerCase().includes(value.toLowerCase()),
      // Muestra el filtro cuando se abre el menú de filtros
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
    },
    {
      title: "Grupo",
      width: 15,
      dataIndex: "grupo",
    },
    {
      title: "Tipo",
      dataIndex: "nivel1",
      width: 15,
    },
    {
      title: "Ver",
      width: 10,
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
    {
      title: "Editar",
      width: 10,
      render: () => (
        <Button
          className="acciones-button"
          icon={<EditOutlined style={{ color: "green" }} />}
          onClick={() => handleEditar(record.id)}
        />
        
      ),
    },
    {
      title: "Eliminar",
      width: 5,
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
      width: 5,
      render: (record) => (
        <Link to="/expertisRH/cargaPruebas">            
        <Button
          className="acciones-button"
          icon={<UploadOutlined style={{ color: "blue" }} />}
          onClick={() => handleCargarPruebas(record.id)}
        />
        </Link>
      ),
    },
  ];

  const data = justificaciones.map((justificacion, index) => {
    return { ...justificacion, key: index };
  });

  return (
    <div className=" flex  flex-col gap-4 items-center justify-start h-vh animate__animated animate__fadeIn">
      <h2
        style={{ color: "#053B50" }}
        className="text-xl  text-center font-bold font-roboto p-5  md:text-5xl md:text-center"
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
          onScroll={true}
          bordered
        />
     
      </div>
    </div>
  );
};

export default Justificaciones;
