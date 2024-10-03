import { useState, useEffect } from 'react';
import { listarMisSolicitudesRequest } from "../../API/vacaciones.js";
import { Table, Tag } from 'antd';
import "../../styles/tabla.css";
import { useAuth } from "../../contexts/AuthContext.jsx";

export const MisSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            if (!user) return; // Asegúrate de que 'user' esté disponible
            
            try {
                const id = user.user.idEmpleado;
                const response = await listarMisSolicitudesRequest(id);
                setSolicitudes(response); // Actualiza el estado con los datos recibidos
            } catch (error) {
                console.error("Hubo un error al obtener las solicitudes de este empleado", error);
            }
        };

        obtenerSolicitudes();
    }, [user]); // Agrega 'user' como dependencia

    const data = solicitudes.map((solicitud, index) => ({
        ...solicitud,
        key: index,
    }));

    const columns = [
        {
            title: 'Fecha Solicitud',
            dataIndex: 'fecSolicitud',
            width: 80,
            render: (text) => <span>{text ? text.slice(0, 10) : 'N/A'}</span>,
        },
        {
            title: 'Fec-Ini',
            dataIndex: 'fecInicial',
            width: 80,
            render: (text) => <span>{text ? text.slice(0, 10) : 'N/A'}</span>,
        },
        {
            title: 'Fec-Fin',
            dataIndex: 'fecFinal',
            width: 80,
            render: (text) => <span>{text ? text.slice(0, 10) : 'N/A'}</span>,
        },
        {
            title: 'Nº Dias',
            dataIndex: 'cantDias',
            width: 50,
        },
        {
            title: 'Nº Dias H',
            dataIndex: 'cantDiasHabiles',
            width: 50,
        },
        {
            title: 'Nº Dias NH',
            dataIndex: 'cantDiasNoHabiles',
            width: 50,
        },
        {
            title: 'Estado',
            dataIndex: 'estadoVacaciones',
            width: 150,
            render: (text, record) => {
                const estado = record.estadoVacaciones || record.estado;
                let color;

                if (estado === "ADMITIDO") {
                    color = 'yellow';
                } else if (estado === "PENDIENTE") {
                    color = 'blue';
                } else if (estado === "APROBADO") {
                  color = 'green';
              } else {
                    color = 'red';
                }

                return (
                    <Tag color={color} style={{ fontWeight: 'bold' }} key={estado}>
                        {estado}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div className='h-screen flex justify-center items-center flex-col m-5'>
            <h1 className='mt-5 text-3xl font-bold font-roboto'>Mis Solicitudes</h1>
            <div className='w-4/5 mt-10 max-h-screen'>
                <Table
                    className="custom-table"
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 360 }}
                />
            </div>
        </div>
    );
};
