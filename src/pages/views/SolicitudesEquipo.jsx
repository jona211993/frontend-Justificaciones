import { useState, useEffect } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { EyeOutlined,DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext.jsx";
import axios from '../../API/axios';
import '../../styles/SolicitudesEquipo.css';

export const SolicitudesEquipo = () => {
    const [aprobadas, setAprobadas] = useState([]);
    const [enProceso, setEnProceso] = useState([]);
    const { setIdSolVac, user } = useAuth();

    useEffect(() => {
        const fetchSolicitudes = async () => {
            if (!user) return; // Asegúrate de que 'user' esté disponible
            
            try {
                const elArea = user.user.idEmpleado === 214 ? 7 : user.user.idArea;
                
                // Fetch solicitudes aprobadas
                const aprobadasResponse = await axios.get(`/obtenerSolicitudesAprobadasEquipo/${elArea}`, { withCredentials: true });
                const aprobadasData = aprobadasResponse.data.data || [];
                console.log('Aprobadas Data:', aprobadasData);
                setAprobadas(aprobadasData);

                // Fetch solicitudes en proceso
                const pendientesResponse = await axios.get(`/obtenerSolicitudesEnProcesoEquipo/${elArea}`, { withCredentials: true });
                const pendientesData = pendientesResponse.data.data || [];
                console.log('En Proceso Data:', pendientesData);
                setEnProceso(pendientesData);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchSolicitudes();
    }, [user]); // Agrega 'user' como dependencia

    const handleVer = (id) => {
        console.log("El id enviado es: " + id);
        setIdSolVac(id);
    };

    const columns = [
        {
            title: 'Fecha de Solicitud',
            dataIndex: 'fecSolicitud',
            key: 'fecSolicitud',
            render: (text) => <span>{text ? text.slice(0, 10) : 'N/A'}</span>,
        },
        {
            title: 'Fecha de Inicio',
            dataIndex: 'fecInicial',
            key: 'fecInicial',
            render: (text) => <span>{text ? text.slice(0, 10) : 'N/A'}</span>,
        },
        {
            title: 'Fecha Final',
            dataIndex: 'fecFinal',
            key: 'fecFinal',
            render: (text) => <span>{text ? text.slice(0, 10) : 'N/A'}</span>,
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
                const color = estado === "ADMITIDO" ? 'yellow' : estado === "PENDIENTE" ? 'blue' : estado === "APROBADO" ? 'green' : 'red';
                return <Tag color={color} style={{ fontWeight: 'bold' }}>{estado}</Tag>;
            },
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
                    {record.idEmpleado !== user.user.idJefe && (
                    <Link to="/expertisRH/verSolicitudVacaciones">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleVer(record.id)}
                        >
                            Ver
                        </Button>
                        
                    </Link>
                )}
                {/* {record.estado === "PENDIENTE" && (
                    <Link to="/expertisRH/verSolicitudVacaciones">
                        <Button
                           type="primary" danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleVer(record.id)}
                        >
                          Eliminar
                        </Button>
                        
                    </Link>
                )} */}
                </Space>
                
            ),
        },
    ];

    return (
        <div className='gap-2' style={{ padding: 10, display: 'flex', flexDirection: 'column', height: '90vh' }}>
            <h2 className='mt-0 font-semibold text-lg'>Solicitudes en Proceso</h2>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                    columns={columnsEnProceso}
                    dataSource={enProceso}
                    rowKey="id"
                    scroll={{ x: '100%', y: 300 }}
                    pagination={{ pageSize: 5 }}
                />
            </div>
            <h2 className='mt-0 font-semibold text-lg'>Solicitudes Aprobadas</h2>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={aprobadas}
                    rowKey="idVacacionesSolicitudes"
                    scroll={{ x: '100%', y: 300 }}
                    pagination={{ pageSize: 5 }}
                />
            </div>
            <br />
        </div>
    );
};
