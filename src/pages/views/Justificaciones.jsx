import React, { useState, useEffect } from 'react';
import { asesoresBySuperRequest } from '../../API/justificaciones.js';

export const Justificaciones = () => {
  // Estado para almacenar los datos de los asesores
  const [asesores, setAsesores] = useState([]);

  // Función para obtener los datos de los asesores
  const obtenerAsesores = async () => {
    try {
      const response = await asesoresBySuperRequest('JORGE'); // Envía el grupo deseado
      console.log(response.data);
      setAsesores(response.data); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Hubo un error al obtener los asesores:', error);
    }
  };

  // Llamada a la función para obtener los asesores al cargar el componente
  useEffect(() => {
    obtenerAsesores();
  }, []);

  return (
    <div>
      <h2>Justificaciones</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {asesores.map(asesor => (
            <tr key={asesor.id}>
              <td>{asesor.id}</td>
              <td>{asesor.usuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Justificaciones;
