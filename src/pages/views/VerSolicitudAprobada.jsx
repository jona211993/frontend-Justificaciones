import React, { useEffect, useState } from 'react';
import { Descriptions, Spin, Tag, Button, Modal, Select, message } from 'antd';
import axios from '../../API/axios.js';
import { useAuth } from '../../contexts/AuthContext';



export const VerSolicitudAprobada = () => {
const { idSolVac } = useAuth();
const [solicitud, setSolicitud] = useState(null);
const [loading, setLoading] = useState(true);
const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedEstado, setSelectedEstado] = useState('');

useEffect(() => {
  const fetchSolicitud = async () => {
    try {
      const response = await axios.get(`/obtenerSolicitudAprobada/${idSolVac}`, { withCredentials: true });
      console.log(response.data.data);
      setSolicitud(response.data.data[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  fetchSolicitud();
}, [idSolVac]);

const formatFecha = (fecha) => {
  return fecha ? fecha.slice(0, 10) : '';
};

const renderEstadoTag = (estado) => {
  let color = 'default';
  if (estado === 'PENDIENTE') {
    color = 'blue';
  } else if (estado === 'APROBADO') {
    color = 'green';
  } else if (estado === 'ADMITIDO') {
    color = 'yellow';
  } else {
    color = 'red';
  }
  return <Tag color={color} style={{ fontWeight: 'bold' }}>{estado}</Tag>;
};

const showModal = () => {
  setIsModalVisible(true);
};

const handleCancel = () => {
  setIsModalVisible(false);
};

const handleConfirm = async () => {
  try {
    const response = await axios.put('/cambiarEstadoSolicitudVacaciones', {
      id: idSolVac,
      estado: selectedEstado
    } , { withCredentials: true });
    console.log(response)
    console.log("el estado enviado es= ",selectedEstado)
    if (response) {
      message.success('Estado actualizado correctamente');
      setSolicitud({ ...solicitud, estado: selectedEstado });
      setIsModalVisible(false);
    } else {
      message.error( {content:'Hubo un error al actualizar el estado'});
      setIsModalVisible(false);
      
    }
  } catch (error) {
    message.error( {content:'Hubo un error al actualizar el estado'});
    setIsModalVisible(false);
  }
};

if (loading) {
  return <Spin size="large" />;
}

  return (
    <div className='pl-10 pr-10 felx flex-row'>
      <Descriptions
        title={<span style={{ fontSize: '22px', fontWeight: 'bold' }}>Detalles de la Solicitud</span>}
        bordered
      >
        <Descriptions.Item label="Empleado">{solicitud.alias}</Descriptions.Item>
        <Descriptions.Item label="Mes">{solicitud.codMes}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Solicitud">{formatFecha(solicitud.fecSolicitud)}</Descriptions.Item>
        <Descriptions.Item label="Fecha de Inicio">{formatFecha(solicitud.fecInicial)}</Descriptions.Item>
        <Descriptions.Item label="Fecha Final">{formatFecha(solicitud.fecFinal)}</Descriptions.Item>
        <Descriptions.Item label="Estado">{renderEstadoTag(solicitud.estadoVacaciones )}</Descriptions.Item>
        <Descriptions.Item label="Cantidad de Días">{solicitud.cantDias}</Descriptions.Item>
        <Descriptions.Item label="Cantidad de Días Habiles">{solicitud.cantDiasHabiles}</Descriptions.Item>
        <Descriptions.Item label="Cantidad de Días NO Habiles">{solicitud.cantDiasNoHabiles}</Descriptions.Item>
        <Descriptions.Item label="Detalle">{solicitud.detalle}</Descriptions.Item>
        <Descriptions.Item label="Tipo">{solicitud.tipoVacaciones}</Descriptions.Item>
        <Descriptions.Item label="Area">{solicitud.nombreArea}</Descriptions.Item>
        
      </Descriptions>
      
    </div>
  );
}
