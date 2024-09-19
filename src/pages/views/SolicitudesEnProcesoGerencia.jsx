import { useState, useEffect } from "react";
import { Table, Tag, Button, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";
import axios from "../../API/axios";
import "../../styles/SolicitudesEquipo.css"; // Importa el archivo CSS para estilos personalizados

export const SolicitudesEnProcesoGerencia = () => {
  const [enProceso, setEnProceso] = useState([]);
  const { setIdSolVac, user } = useAuth();
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const pendientesResponse = await axios.get(
          `/obtenerSolicitudesAdmitidasTodas`,
          { withCredentials: true }
        );
        const pendientesData = pendientesResponse.data.data || [];
        setEnProceso(pendientesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleVer = (id) => {
    console.log("El id enviado es: " + id);
    setIdSolVac(id);
  };

  const handleTableChange = (pagination, filters) => {
    setPagination(pagination);
    setFilters(filters);
  };

  const getUniqueAreas = (data) => {
    const areas = [...new Set(data.map((item) => item.nombreArea))];
    return areas.map((area) => ({ text: area, value: area }));
  };

  const columns = [
    {
      title: "Fecha de Solicitud",
      dataIndex: "fecSolicitud",
      key: "fecSolicitud",
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Fecha de Inicio",
      dataIndex: "fecInicial",
      key: "fecInicial",
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Fecha Final",
      dataIndex: "fecFinal",
      key: "fecFinal",
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: "Empleado",
      dataIndex: "alias",
      key: "empleado",
    },
    {
      title: "Estado",
      dataIndex: "estadoVacaciones",
      width: 150,
      render: (text, record) => {
        if (!record.estadoVacaciones) {
          if (record.estado === "ADMITIDO") {
            return (
              <Tag
                color="yellow"
                style={{ fontWeight: "bold" }}
                key={record.estado}
              >
                {record.estado}
              </Tag>
            );
          } else if (record.estado === "PENDIENTE") {
            return (
              <Tag
                color="blue"
                style={{ fontWeight: "bold" }}
                key={record.estado}
              >
                {record.estado}
              </Tag>
            );
          } else {
            return (
              <Tag
                color="red"
                style={{ fontWeight: "bold" }}
                key={record.estado}
              >
                {record.estado}
              </Tag>
            );
          }
        }
        return (
          <Tag
            color="green"
            style={{ fontWeight: "bold" }}
            key={record.estadoVacaciones || record.estado}
          >
            {record.estadoVacaciones || record.estado}
          </Tag>
        );
      },
    },
    {
      title: "Cantidad de Días",
      dataIndex: "cantDias",
      key: "cantDias",
    },
    {
      title: "Área",
      dataIndex: "nombreArea",
      key: "nombreArea",
      filters: getUniqueAreas(enProceso),
      filteredValue: filters.nombreArea || null,
      onFilter: (value, record) => record.nombreArea.includes(value),
    },
  ];
  const ruta =
    user.user.id_cargo === 9
      ? "/expertisRH/verSolicitudVacaciones"
      : "/expertisRH/verSolicitudAprobada";
  const columnsEnProceso = [
    ...columns,
    {
      title: "Acción",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={ruta}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleVer(record.id)}
            >
              Ver
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="gap-5 "
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "column",
        height: "90vh",
      }}
    >
      <h2 className="mt-0 font-semibold text-lg">
        Solicitudes Pendientes Por Revisar
      </h2>    

      <div style={{ flex: 1, overflow: "auto" }}>
        <Table
          columns={columnsEnProceso}
          dataSource={enProceso}
          rowKey="idVacacionesSolicitudes"
          scroll={{ x: "100%", y: 500 }} // Ajusta la altura del scroll según sea necesario
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      <br />
    </div>
  );
};
