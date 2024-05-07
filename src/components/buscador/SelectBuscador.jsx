import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { asesoresBySuperRequest } from '../../API/justificaciones.js';

const { Option } = Select;

const SelectBuscador = () => {
  // Estado para almacenar los datos de los asesores
  const [asesores, setAsesores] = useState([]);
  // Estado para almacenar el valor del asesor seleccionado
  const [asesorSeleccionado, setAsesorSeleccionado] = useState('');

  // Función para obtener los datos de los asesores
  const obtenerAsesores = async () => {
    try {
      const response = await asesoresBySuperRequest('JORGE'); // Envía el grupo deseado
      setAsesores(response.data); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Hubo un error al obtener los asesores:', error);
    }
  };

  // Llamada a la función para obtener los asesores al cargar el componente
  useEffect(() => {
    obtenerAsesores();
  }, []);

  // Función para manejar el cambio en el Select de asesores
  const handleAsesorChange = value => {
    setAsesorSeleccionado(value);
  };

  return (
    <div className='bg-white'>
      <h2>Asesor</h2>
      <Form.Item name="asesor">
        <Select
          showSearch
          placeholder="Seleccione un asesor"
          value={asesorSeleccionado}
          onChange={handleAsesorChange}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {asesores.map(asesor => (
            <Option key={asesor.id} value={asesor.usuario}>
              {asesor.usuario}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  );
};

export default SelectBuscador;
