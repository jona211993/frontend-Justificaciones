/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { listarEmpleadosStaffRequest } from "../../API/empleadosStaff.js";
import { Table,DatePicker } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import axios from "../../API/axios.js";
import dayjs from 'dayjs';

import "../../styles/tabla.css";
// import AsyncCellTruncas from '../../components/AsyncCellTruncas.jsx';
import AsyncCellPendientes from '../../components/AsyncCellPendientes.jsx';
import AsyncCellVencidas from '../../components/AsyncCellVencidas.jsx';
import AsyncCellNumMesesPeriodo from '../../components/AsyncCellNumMesesPeriodo.jsx';

const EmpleadosAlertaVacaciones = () => {

    const [empleadosStaff, setEmpleadosStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    //PARA OBTENER  EL ULTMO DA DEL MES  ANTERIOR
    const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
    const [fechaElegida, setFechaElegida] = useState(lastDayOfPreviousMonth);

    const obtenerEmpleadosStaff = async () => {
        setLoading(true);
        try {
            const response = await listarEmpleadosStaffRequest();
            const empleados = response.data;

            // Precalcular los valores de TRUNCAS
            const empleadosConValores = await Promise.all(
                empleados.map(async (empleado) => {
                    const datos = await obtenerValorTruncas(empleado.idEmpleado[0]

                    );                  
                  
                    return {
                        ...empleado,  
                        datos,                        
                    };
                })
            );
             
           return empleadosConValores
            
            
        } catch (error) {
            console.error("Hubo un error al obtener los empleados del Staff", error);
        } finally {
            setLoading(false);
            console.log("------ > ", empleadosStaff)
        }
    };
  
   // Función para obtener el valor de TRUNCAS
   const obtenerValorTruncas = async (idEmpleado) => {
    try {
        const response = await axios.post('/obtenerInfoVacaciones', { idEmpleado, fecMes:fechaElegida });
        // console.log(response.data.data)
        return response.data.data; // Ajusta esto según la respuesta de tu API
        
    } catch (error) {
        console.error(`Error al obtener TRUNCAS para el empleado ${idEmpleado}:`, error);
        return 0; // Valor por defecto si hay un error
    }
};


useEffect(() => {
  const fetchEmpleadosStaff = async () => {
      try {
          const empleados = await obtenerEmpleadosStaff(); // Espera a que se resuelva la promesa
          console.log(empleados); // Imprime los empleados obtenidos
          setEmpleadosStaff(empleados); // Establece el estado con los empleados obtenidos
      } catch (error) {
          console.error('Error al obtener empleados staff:', error); // Maneja errores
      }
  };

  fetchEmpleadosStaff(); // Llama a la función asíncrona
}, [fechaElegida]);
  
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
        title: 'Fec Ingreso',
        dataIndex: 'fecIngreso', // Asegúrate de que 'cargo' sea la propiedad correcta en tus datos
        width: 150,
        render: (fecha) => (fecha ? dayjs(fecha).format('YYYY-MM-DD') : ''),
      } ,
      // {
      //   title: '# Meses Nuevo Periodo',
      //   dataIndex: 'idEmpleado',
      //   key: 'numMeses',
      //   width: 150,
      //   render: (idEmpleado) => (
      //     <AsyncCellNumMesesPeriodo
      //       idEmpleado={idEmpleado[0]}
      //       endpoint="/obtenerInfoVacaciones"
      //       fechaElegida={fechaElegida}
      //       title="Cálculo Meses"
      //     />
      //   ),
      // },
      {
        title: 'TRUNCAS',
        dataIndex: 'datos', // Apuntamos a 'datos'
        key: 'idEMpleado', // Una clave única para esta columna
        render: (datos) => datos?.[0]?.Truncas || '0',
        sorter: (a, b) => (a.datos?.[0]?.Truncas || 0) - (b.datos?.[0]?.Truncas || 0), // Ordenar de mayor a menor
        width: 150,
    },
      // {
      //   title: 'PENDIENTES',
      //   dataIndex: 'idEmpleado',
      //   key: 'vPendientes',
      //   width: 150,
      //   render: (idEmpleado) => (
      //     <AsyncCellPendientes
      //       idEmpleado={idEmpleado[0]}
      //       endpoint="/obtenerInfoVacaciones"
      //       fechaElegida={fechaElegida}
      //       title="Cálculo 2"
      //     />
      //   ),
      // },
      {
        title: 'PENDIENTES',
        dataIndex: 'datos', // Apuntamos a 'datos'
        key: 'idEMpleado', // Una clave única para esta columna
        render: (datos) => datos?.[0]?.Pendientes || '0',
        sorter: (a, b) => (a.datos?.[0]?.Pendientes || 0) - (b.datos?.[0]?.Pendientes || 0), // Ordenar de mayor a menor
        width: 150,
    },
      
    {
      title: 'VENCIDAS',
      dataIndex: 'datos', // Apuntamos a 'datos'
      key: 'idEMpleado', // Una clave única para esta columna
      render: (datos) => datos?.[0]?.Vencidas || '0',
      sorter: (a, b) => (a.datos?.[0]?.Vencidas || 0) - (b.datos?.[0]?.Vencidas || 0), // Ordenar de mayor a menor
      width: 150,
  },
    
    ];

    const onChange = (date, dateString) => {
      console.log(dateString);
      setFechaElegida(dateString)
    };
  
    return (
      <div className=' h-screen flex justify-center items-center flex-col m-5 '>
        <h1 className='mt-20 text-cyan-950 text-3xl'> Posibles Empleados con Alertas</h1>
        <div className='mt-5 flex  items-center justify-center gap-10'>
           <label className=' text-red-500 font-bold'> EL cálculo está siendo ejecutado a la fecha : </label>
            {fechaElegida? <label className='text-xl font-semibold'>{fechaElegida}</label> : <></>}
        </div>
        <div className='mt-5 flex gap-10 items-center'> 
          <label className='font-semibold text-lg'> Para recalcular a una fecha específca: </label>
        <DatePicker onChange={onChange} placeholder='Elija una fecha' />

       
        </div>
        
        { data ? (<div className='w-full mt-10 max-h-screen'>
          <Table
            className="custom-table"
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 50,
            }}
            scroll={{
              y: 340,
            }}
          />
        </div>) : (<></>)

        }
        
      </div>
    );
}

export default EmpleadosAlertaVacaciones