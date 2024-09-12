import React, { useState, useEffect } from 'react';
import { listarMisSolicitudesRequest} from "../../API/vacaciones.js";
import { Table ,Tag} from 'antd';
import "../../styles/tabla.css";
import { useAuth } from "../../contexts/AuthContext.jsx";


export const MisSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const { user } = useAuth();
    
    const obtenerSolicitudes = async () => {
      try {
        const id= user.user.idEmpleado;
        const response = await listarMisSolicitudesRequest(id);
        setSolicitudes(response); // Actualiza el estado con los datos recibidos
      } catch (error) {
        console.error("Hubo un error al obtener las solicitudes de este empleado", error);
      }
    };
  
    useEffect(() => {
      obtenerSolicitudes();
    }, []);
  
    const data = solicitudes.map((solicitud, index) => ({
      ...solicitud,
      key: index
    }));
  
    
    const columns = [
      {
        title: 'Fecha Solicitud',
        dataIndex: 'fecSolicitud', // Asegúrate de que 'alias' sea la propiedad correcta en tus datos
        width: 80,
        render: (text) => {
            return <span>{text.slice(0, 10)}</span>;
          },
      },
      {
        title: 'Fec-Ini',
        dataIndex: 'fecInicial', // Asegúrate de que 'area' sea la propiedad correcta en tus datos
        width: 80,  
        render: (text) => {
            return <span>{text.slice(0, 10)}</span>;
          },     
      },
      {
        title: 'Fec-Fin',
        dataIndex: 'fecFinal', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
        width: 80,
        render: (text) => {
            return <span>{text.slice(0, 10)}</span>;
          },
      },
      {
        title: 'Nº Dias',
        dataIndex: 'cantDias', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
        width: 50,
      },
      {
        title: 'Nº Dias H',
        dataIndex: 'cantDiasHabiles', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
        width: 50,
      },
      {
        title: 'Nº Dias NH',
        dataIndex: 'cantDiasNoHabiles', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
        width:50,
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
      }
    
    ];
  
    return (
      <div className=' h-screen flex justify-center items-center flex-col m-5'>
        <h1 className='mt-5 text-3xl font-bold font-roboto '>Mis Solicitudes</h1>
        <div className=' w-4/5 mt-10 max-h-screen'>
          <Table
            className="custom-table"
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 50,
            }}
            scroll={{
              y: 240,
            }}
          />
        </div>
      </div>
    );
}
