import { useState, useEffect } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext.jsx";
import { FilterOutlined } from '@ant-design/icons';

import axios from '../../API/axios';
import '../../styles/SolicitudesEquipo.css'; // Importa el archivo CSS para estilos personalizados

export const SolicitudesAprobadasGerencia = () => {
  const [enProceso, setEnProceso] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { setIdSolVac } = useAuth(); // Elimina `user` si ya no es necesario
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  // Define los IDs de empleados permitidos para el filtro
  const allowedEmployeeIds = [167,
    170,
    219,
    179,
    209,
    196
    ]; // Sustituye estos valores con los IDs que correspondan

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const pendientesResponse = await axios.get(`/obtenerSolicitudesAprobadasTodas`, { withCredentials: true });
        const pendientesData = pendientesResponse.data.data || [];
        setEnProceso(pendientesData);
        setFilteredData(pendientesData); // Inicializa el estado de datos filtrados
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleApplyFilter = () => {
    const filtered = enProceso.filter(item => allowedEmployeeIds.includes(item.idEmpleado));
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setFilteredData(enProceso); // Restaura los datos originales
  };

  const getUniqueAreas = (data) => {
    const areas = [...new Set(data.map(item => item.nombreArea))];
    return areas.map(area => ({ text: area, value: area }));
  };

  const columns = [
    {
      title: 'Fecha de Solicitud',
      dataIndex: 'fecInsert',
      key: 'fecSolicitud',
      render: (text) => <span>{text ? text.slice(0, 10) : ''}</span>,
    },
    {
      title: 'Fecha de Inicio',
      dataIndex: 'fecInicial',
      key: 'fecInicial',
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: 'Fecha Final',
      dataIndex: 'fecFinal',
      key: 'fecFinal',
      render: (text) => <span>{text.slice(0, 10)}</span>,
    },
    {
      title: 'Empleado',
      dataIndex: 'alias',
      key: 'empleado',
    },
    {
      title: 'Estado',
      dataIndex: 'estadoVacaciones',
      width: 150,
      render: (text, record) => {
        const estado = record.estadoVacaciones || record.estado;
        const color = estado === "ADMITIDO" ? 'yellow' :
                      estado === "PENDIENTE" ? 'blue' :
                      estado === "APROBADO" ? 'green' : 'red';
        return (
          <Tag color={color} style={{ fontWeight: 'bold' }} key={estado}>
            {estado}
          </Tag>
        );
      },
    },
    {
      title: 'Cantidad de Días',
      dataIndex: 'cantDias',
      key: 'cantDias',
    },
    {
      title: 'Área',
      dataIndex: 'nombreArea',
      key: 'nombreArea',
      filters: getUniqueAreas(filteredData),
      filteredValue: filters.nombreArea || null,
      onFilter: (value, record) => record.nombreArea.includes(value),
    },
  ];

  const columnsEnProceso = [
    ...columns,
    {
      title: 'Acción',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link to="/expertisRH/verSolicitudAprobada">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleVer(record.idVacacionesSolicitudes)}
            >
              Ver
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div className='gap-2' style={{ padding: 10, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <h2 className='mt-0 font-semibold text-lg'>Solicitudes Aprobadas</h2>
      <Space>
        <Button className='bg-cyan-700  text-white font-semibold' onClick={handleApplyFilter} icon={<FilterOutlined />}>Filtro Solo Jefes</Button> 
        <Button onClick={handleClearFilter}>Quitar Filtro</Button>
      </Space>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columnsEnProceso}
          dataSource={filteredData} // Usa los datos filtrados
          rowKey="idVacacionesSolicitudes"
          scroll={{ x: '100%', y: 500 }}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};
