import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext.jsx";
import axios from '../../API/axios';
import '../../styles/SolicitudesEquipo.css'; // Importa el archivo CSS para estilos personalizados



export const SolicitudesEquipo = () => {
    const [aprobadas, setAprobadas] = useState([]);
    const [enProceso, setEnProceso] = useState([]);
    const { setIdSolVac,user} = useAuth();
     
    
    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const elArea =user.user.idEmpleado==214 ? 7 : user.user.idArea
                console.log(elArea)
                const aprobadasResponse = await axios.get(`/obtenerSolicitudesAprobadasEquipo/${elArea}`, { withCredentials: true });
               

                const aprobadasData = aprobadasResponse.data.data || [];
              
                setAprobadas(aprobadasData);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchSolicitudes();
    }, []);


    useEffect(() => {
      const fetchSolicitudesPendientes = async () => {
        try {
          const elArea =user.user.idEmpleado==214 ? 7 : user.user.idArea
          const pendientesResponse = await axios.get(`/obtenerSolicitudesEnProcesoEquipo/${elArea}`, { withCredentials: true });
          const pendientesData = pendientesResponse.data.data || [];
          
          setEnProceso(pendientesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchSolicitudesPendientes();
    }, []);
  

    const handleVer = (id) => {
        console.log("El id enviado es: " + id);
        setIdSolVac(id);
      };

    const columns = [
        {
            title: 'Fecha de Solicitud',
            dataIndex: 'fecSolicitud',
            key: 'fecSolicitud',
            render: (text) => <span>{text.slice(0, 10)}</span>,
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
            dataIndex: 'estadoVacaciones', // Asegúrate de que 'estadoVacaciones' sea la propiedad correcta en tus datos
            width: 150,
            render: (text, record) => {
              // Utiliza 'estadoVacaciones' si está presente, de lo contrario utiliza 'estado'
              if (!record.estadoVacaciones) {
                if (record.estado === "ADMITIDO") {
                  return (
                    <Tag color='yellow' style={{ fontWeight: 'bold' }} key={record.estado}>
                      {record.estado}
                    </Tag>
                  );
                } else if (record.estado === "PENDIENTE") {
                  return (
                    <Tag color='blue' style={{ fontWeight: 'bold' }} key={record.estado}>
                      {record.estado}
                    </Tag>
                  );
                } else {
                  return (
                    <Tag color='red'  style={{ fontWeight: 'bold' }} key={record.estado}>
                      {record.estado}
                    </Tag>
                  );
                }
              }
              return (
                <Tag color='green' style={{ fontWeight: 'bold' }} key={record.estadoVacaciones || record.estado}>
                  {record.estadoVacaciones || record.estado}
                </Tag>
              );
            }
          },
        {
            title: 'Cantidad de Días',
            dataIndex: 'cantDias',
            key: 'cantDias',
        },
    ];

    const columnsEnProceso = [
        ...columns,
        {
            title: 'Acción',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                <Link to="/expertisRH/verSolicitudVacaciones">
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
        <div className='gap-2 ' style={{ padding: 10, display: 'flex', flexDirection: 'column', height: '90vh'}}>
            <h2 className='mt-0 font-semibold text-lg' >Solicitudes en Proceso</h2>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                    columns={columnsEnProceso}
                    dataSource={enProceso}
                    rowKey="idVacacionesSolicitudes"
                    scroll={{ x: '100%', y: 300 }} // Ajusta la altura del scroll según sea necesario
                    pagination={{ pageSize: 5 }}
                />
            </div>
            <h2 className='mt-0 font-semibold text-lg'>Solicitudes Aprobadas</h2>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={aprobadas}
                    rowKey="idVacacionesSolicitudes"
                    scroll={{ x: '100%', y: 300 }} // Ajusta la altura del scroll según sea necesario
                    pagination={{ pageSize: 5 }}                    
                />
            </div>
            <br />
        </div>
    );
};
