import { useState, useEffect } from 'react';
import { listarEmpleadosStaffRequest } from "../../API/empleadosStaff.js";
import { Table, DatePicker, Spin } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import axios from "../../API/axios.js";
import dayjs from 'dayjs';

import "../../styles/tabla.css";

const EmpleadosAlertaVacaciones = () => {
  const [empleadosStaff, setEmpleadosStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastDayOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
  const [fechaElegida, setFechaElegida] = useState(lastDayOfPreviousMonth);

  const obtenerEmpleadosStaff = async () => {
    setLoading(true);
    try {
      const response = await listarEmpleadosStaffRequest();
      const empleados = response.data;

      const empleadosConValores = [];
      for (const empleado of empleados) {
        const datos = await obtenerValorTruncas(empleado.idEmpleado[0]);
        empleadosConValores.push({ ...empleado, datos });
      }

      return empleadosConValores;
    } catch (error) {
      console.error("Hubo un error al obtener los empleados del Staff", error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerValorTruncas = async (idEmpleado) => {
    try {
      const response = await axios.post('/obtenerInfoVacaciones', { idEmpleado, fecMes: fechaElegida });
      return response.data.data;
    } catch (error) {
      console.error(`Error al obtener TRUNCAS para el empleado ${idEmpleado}:`, error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchEmpleadosStaff = async () => {
      try {
        const empleados = await obtenerEmpleadosStaff();
        setEmpleadosStaff(empleados);
      } catch (error) {
        console.error('Error al obtener empleados staff:', error);
      }
    };

    fetchEmpleadosStaff();
  }, [fechaElegida]);

  const data = empleadosStaff.map((empleado, index) => ({
    ...empleado,
    key: index
  }));

  const areaOptions = [...new Set(empleadosStaff.map(empleado => empleado.nombreArea))].map(area => ({
    text: area,
    value: area,
  }));

  const columns = [
    {
      title: 'Empleado',
      dataIndex: 'EMPLEADO',
      width: 150,
    },
    {
      title: 'Área',
      dataIndex: 'nombreArea',
      width: 150,
      filters: areaOptions,
      onFilter: (value, record) => record.nombreArea === value,
      filterIcon: (filtered) => <FilterOutlined style={{ color: filtered ? '#FF0000' : '#FFFFFF' }} />,
    },
    {
      title: 'Cargo',
      dataIndex: 'CARGO',
      width: 150,
    },
    {
      title: 'Fec Ingreso',
      dataIndex: 'fecIngreso',
      width: 150,
      render: (fecha) => (fecha ? dayjs(fecha).format('YYYY-MM-DD') : ''),
    },
    {
      title: '# Meses Nuevo Periodo',
      dataIndex: 'datos',
      width: 150,
      render: (datos) => {
        if (!datos || !datos[0]?.FEC_INICIOTRUNCAS) return "Sin datos";
    
        // Calcula la diferencia en meses
        const mesesTranscurridos = dayjs(fechaElegida).diff(dayjs(datos[0].FEC_INICIOTRUNCAS).format("YYYY-MM-DD"), "months", true);
        return mesesTranscurridos.toFixed(1); // Redondea a 0 decimal
      },
    },
    {
      title: 'TRUNCAS',
      dataIndex: 'datos',
      key: 'truncas',
      render: (datos) => datos?.[0]?.Truncas || '0',
      sorter: (a, b) => (a.datos?.[0]?.Truncas || 0) - (b.datos?.[0]?.Truncas || 0),
      width: 150,
    },
    {
      title: 'PENDIENTES',
      dataIndex: 'datos',
      key: 'pendientes',
      render: (datos) => datos?.[0]?.Pendientes || '0',
      sorter: (a, b) => (a.datos?.[0]?.Pendientes || 0) - (b.datos?.[0]?.Pendientes || 0),
      width: 150,
    },
    {
      title: 'VENCIDAS',
      dataIndex: 'datos',
      key: 'vencidas',
      render: (datos) => datos?.[0]?.Vencidas || '0',
      sorter: (a, b) => (a.datos?.[0]?.Vencidas || 0) - (b.datos?.[0]?.Vencidas || 0),
      width: 150,
    },
  ];

  const onChange = (date, dateString) => {
    setFechaElegida(dateString);
  };

  return (
    <div className='h-screen flex justify-center items-center flex-col m-5'>
      <h1 className='mt-20 text-cyan-950 text-3xl'>Posibles Empleados con Alertas</h1>
      <div className='mt-5 flex items-center justify-center gap-10'>
        <label className='text-red-500 font-bold'>El cálculo está siendo ejecutado a la fecha:</label>
        {fechaElegida && <label className='text-xl font-semibold'>{fechaElegida}</label>}
      </div>
      <div className='mt-5 flex gap-10 items-center'>
        <label className='font-semibold text-lg'>Para recalcular a una fecha específica:</label>
        <DatePicker onChange={onChange} placeholder='Elija una fecha' />
      </div>

      {loading ? (
        <div className="w-full mt-10 flex justify-center items-center">
          <Spin size="large" tip="Cargando datos..." />
        </div>
      ) : (
        <div className='w-full mt-10 max-h-screen'>
          <Table
            className="custom-table"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 50 }}
            scroll={{ y: 340 }}
          />
        </div>
      )}
    </div>
  );
};

export default EmpleadosAlertaVacaciones;
