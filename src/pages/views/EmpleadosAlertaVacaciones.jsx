/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { listarEmpleadosStaffRequest } from "../../API/empleadosStaff.js";
import { Table } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import axios from "../../API/axios.js";


import "../../styles/tabla.css";
// import AsyncCellTruncas from '../../components/AsyncCellTruncas.jsx';
import AsyncCellPendientes from '../../components/AsyncCellPendientes.jsx';
import AsyncCellVencidas from '../../components/AsyncCellVencidas.jsx';
const EmpleadosAlertaVacaciones = () => {

    const [empleadosStaff, setEmpleadosStaff] = useState([]);
    const [loading, setLoading] = useState(false);

    const obtenerEmpleadosStaff = async () => {
        setLoading(true);
        try {
            const response = await listarEmpleadosStaffRequest();
            const empleados = response.data;

            // Precalcular los valores de TRUNCAS
            const empleadosConValores = await Promise.all(
                empleados.map(async (empleado) => {
                    const truncas = await obtenerValorTruncas(empleado.idEmpleado[0]);
                    return {
                        ...empleado,
                        truncas,
                    };
                })
            );

            setEmpleadosStaff(empleadosConValores);
        } catch (error) {
            console.error("Hubo un error al obtener los empleados del Staff", error);
        } finally {
            setLoading(false);
        }
    };
  
   // Función para obtener el valor de TRUNCAS
   const obtenerValorTruncas = async (idEmpleado) => {
    try {
        const response = await axios.post('/obtenerInfoVacaciones', { idEmpleado, fecMes:"2024-12-01" });
        return response.data.data[0].Truncas; // Ajusta esto según la respuesta de tu API
    } catch (error) {
        console.error(`Error al obtener TRUNCAS para el empleado ${idEmpleado}:`, error);
        return 0; // Valor por defecto si hay un error
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
    const areaOptions = [...new Set(empleadosStaff.map(empleado => empleado.nombreArea))].map(area => ({
      text: area,
      value: area,
    }));
    
  
    const columns = [
        // {
        //     title: 'id',
        //     dataIndex: 'idEmpleado', // Asegúrate de que 'alias' sea la propiedad correcta en tus datos
        //     width: 150,
        //     render: (idEmpleado) => Array.isArray(idEmpleado) ? idEmpleado[0] : idEmpleado,
        //   },
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
        onFilter: (value, record) => record.nombreArea === value,
        filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#FF0000' : '#FFFFFF' }} />,
      },
      {
        title: 'Cargo',
        dataIndex: 'CARGO', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
        width: 150,
      } ,
      {
        title: 'TRUNCAS',
        dataIndex: 'truncas', // Ahora usamos el valor precalculado
        sorter: (a, b) => b.truncas - a.truncas, // Ordenar de mayor a menor
        width: 150,
    },
      {
        title: 'PENDIENTES',
        dataIndex: 'idEmpleado',
        key: 'vPendientes',
        width: 150,
        render: (idEmpleado) => (
          <AsyncCellPendientes
            idEmpleado={idEmpleado[0]}
            endpoint="/obtenerInfoVacaciones"
            title="Cálculo 2"
          />
        ),
      },
      {
        title: 'VENCIDAS',
        dataIndex: 'idEmpleado',
        key: 'vVencidas',
        width: 150,
        render: (idEmpleado) => (
          <AsyncCellVencidas
            idEmpleado={idEmpleado[0]}
            endpoint="/obtenerInfoVacaciones"
            title="Cálculo 3"
          />
        ),
      },
    
    ];
  
    return (
      <div className=' h-screen flex justify-center items-center flex-col m-5'>
        <h1 className='mt-5 text-cyan-950 text-3xl'> Posibles Empleados con Alertas</h1>
        <div className='w-full mt-10 max-h-screen'>
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

export default EmpleadosAlertaVacaciones