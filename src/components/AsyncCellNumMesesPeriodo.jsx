/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import axios from "../API/axios.js";
import dayjs from 'dayjs';

const AsyncCellNumMesesPeriodo= ({ idEmpleado, endpoint, title, fechaElegida }) => {
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          console.log(endpoint)
          const response = await axios.post(endpoint, { idEmpleado,  fecMes: fechaElegida });
          console.log("ESTOY EN EL CALCULOOO:", response.data.data[0].FEC_INICIOTRUNCAS)
          const valorMesesDesdeElCierreDelUltimoPeriodo= dayjs(fechaElegida).diff(dayjs(response.data.data[0].FEC_INICIOTRUNCAS).format('YYYY-MM-DD'),'month')
          setValue(valorMesesDesdeElCierreDelUltimoPeriodo); // Asegúrate de ajustar según tu API
        } catch (error) {
          console.log(`Error fetching ${title}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [idEmpleado, endpoint]);
  
    return loading ? <Spin /> : <span>{value}</span>;
}

export default AsyncCellNumMesesPeriodo