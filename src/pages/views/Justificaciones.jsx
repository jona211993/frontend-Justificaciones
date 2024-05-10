import React, { useState, useEffect } from 'react';
import { listarJustificacionesRequest } from '../../API/justificaciones.js';
import { Table } from 'antd';


export const Justificaciones = () => {
  // Estado para almacenar los datos de los asesores
  const [justificaciones, setJustificaciones] = useState([]);

  // Función para obtener los datos de los asesores
  const obtenerJustificaciones = async () => {
    try {
      const response = await listarJustificacionesRequest(); // Envía el grupo deseado
      console.log(response.data);
      setJustificaciones(response); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Hubo un error al obtener las justificaciones:', error);
    }
  };

  // Llamada a la función para obtener los asesores al cargar el componente
  useEffect(() => {
    obtenerJustificaciones();
    
  }, []);
  
  // para el componente de table de ant design

const columns = [
  {
    title: 'Fecha',
    width: 100,
    dataIndex: 'fecha',
    fixed: 'left',
  },
  {
    title: 'Asesor',
    width: 300,
    dataIndex: 'asesor',
  },
  {
    title: 'Grupo',
    width:100,
    dataIndex: 'grupo',
    fixed: 'left',
  },
  {
    title: 'Tipo',
    dataIndex: 'nivel1',
    width:100
  },
 
  {
    title: 'Ver',
    fixed: 'right',
    width: 90,
    render: () => <a>Ver</a>,
  },
  {
    title: 'Editar',
    width: 90,
    render: () => <a>Editar</a>,
  },
  {
    title: 'Eliminar',
    fixed: 'right',
    width: 90,
    render: () => <a>Eliminar</a>,
  },
];

const data = justificaciones


// ------------------------



  return (
    <div>
      <h2>Justificaciones</h2>
     <Table
       columns={columns}
       dataSource={data}
       scroll={{
         x: 1300,
       }}
       pagination={false}
       bordered
     />

    
    </div>
  );
};

export default Justificaciones;
