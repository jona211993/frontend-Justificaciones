/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import axios from "../API/axios.js";

const AsyncCellPendientes = ({ idEmpleado, endpoint, title }) => {
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          console.log(endpoint)
          const response = await axios.post(endpoint, { idEmpleado,  fecMes: "2024-12-01" });
          setValue(response.data.data[0].Pendientes); // Asegúrate de ajustar según tu API
        } catch (error) {
          console.error(`Error fetching ${title}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [idEmpleado, endpoint]);
  
    return loading ? <Spin /> : <span>{value}</span>;
}

export default AsyncCellPendientes