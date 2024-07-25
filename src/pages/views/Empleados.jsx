import React, { useState, useEffect } from 'react';
import { listarEmpleadosStaffRequest } from "../../API/empleadosStaff.js";
import { Table } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import "../../styles/tabla.css";

export const Empleados = () => {
  const [empleadosStaff, setEmpleadosStaff] = useState([]);

  const obtenerEmpleadosStaff = async () => {
    try {
      const response = await listarEmpleadosStaffRequest();
      setEmpleadosStaff(response.data); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error("Hubo un error al obtener los empleados del Staff", error);
    }
  };

  useEffect(() => {
    obtenerEmpleadosStaff();
  }, []);

  const data = empleadosStaff.map((empleado, index) => ({
    ...empleado,
    key: index
  }));

  // Obtener las opciones únicas para el filtro de "Área"
  const areaOptions = [...new Set(empleadosStaff.map(empleado => empleado.area))].map(area => ({
    text: area,
    value: area,
  }));

  const columns = [
    {
      title: 'Empleado',
      dataIndex: 'EMPLEADO', // Asegúrate de que 'alias' sea la propiedad correcta en tus datos
      width: 150,
    },
    {
      title: 'Área',
      dataIndex: 'nombreArea', // Asegúrate de que 'area' sea la propiedad correcta en tus datos
      width: 150,
      filters: areaOptions,
      onFilter: (value, record) => record.area.includes(value),
      filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#FF0000' : '#FFFFFF' }} />,
    },
    {
      title: 'Cargo',
      dataIndex: 'CARGO', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
      width: 150,
    },
  ];

  return (
    <div className=' h-screen flex justify-center items-center flex-col m-5'>
      <h1 className='mt-5 text-cyan-950 text-3xl'>Empleados Staff</h1>
      <div className='w-3/5 mt-10 max-h-screen'>
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
};
