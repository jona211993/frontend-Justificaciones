import { useState, useEffect } from 'react';
import { listarMisSolicitudesRequest } from "../../API/vacaciones.js";
import { DeleteOutlined } from '@ant-design/icons';
import { Table, Tag, Button, Space, Modal, message } from 'antd';
import "../../styles/tabla.css";
import { useAuth } from "../../contexts/AuthContext.jsx";
import axios from "../../API/axios.js";

export const MisSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const { user } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null); // Almacena el ID de la solicitud a eliminar

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

    const showDeleteModal = (id) => {
        setIdToDelete(id);
        setIsModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            // Llamada a la API con axios
            const response = await axios.delete('/eliminarSolicitudVacacionesPendiente', {
                data: { id: idToDelete }, // Envía el ID en el cuerpo
            });
             console.log(response)
            if (response.status === 200) {
                message.success("Solicitud eliminada exitosamente");
                setSolicitudes(prev => prev.filter(solicitud => solicitud.id !== idToDelete)); // Actualiza la lista local
            } else {
                // Si el estado no es 200, muestra un mensaje de error
                message.error(response.data?.message || "No se pudo eliminar la solicitud. Intente nuevamente.");
            }
        } catch (error) {
            console.error("Error al eliminar la solicitud", error);
            message.error(error.response?.data?.message || "Ocurrió un error al intentar eliminar la solicitud.");
        } finally {
            setIsModalVisible(false);
            setIdToDelete(null);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIdToDelete(null);
    };

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
            width: 70,
            render: (text, record) => {
                const estado = record.estadoVacaciones || record.estado;
                let color;

                if (estado === "PENDIENTE") {
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
        {
            title: 'Acción',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <Space size="middle">
                    {record.estado === "PENDIENTE" && (
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(record.id)}
                        >
                            Eliminar
                        </Button>
                    )}
                </Space>
            ),
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
            <Modal
                title="Confirmación"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancel}
                okText="Confirmar"
                cancelText="Cancelar"
            >
                <p>¿Está seguro de que desea eliminar esta solicitud?</p>
            </Modal>
        </div>
    );
};
