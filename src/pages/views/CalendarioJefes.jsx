import { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import axios from '../../API/axios';

export const CalendarioJefes = () => {
  const localizer = dayjsLocalizer(dayjs);
  const [datosSolJefes, setDatosSolJefes] = useState([]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const datosJefesResponse = await axios.get(`/obtenerSolicitudesCalendarioJefes`, { withCredentials: true });
        const datosJefesData = datosJefesResponse.data.data || []; // Asegúrate de acceder al array de datos correcto
        setDatosSolJefes(datosJefesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSolicitudes();
  }, []); 

  // Transformar los datos obtenidos en el array de eventos para el calendario
  const eventos = datosSolJefes.map((solicitud) => ({
    start: dayjs(solicitud.fecInicial).add(1, 'day').toDate(),
    end: dayjs(solicitud.fecFinal).add(1, 'day').toDate(), // Añadir un día a la fecha final
    title: `${solicitud.alias} - ${solicitud.estado}`
  }));

  const generateColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  const eventPropGetter = (event) => {
    const backgroundColor = generateColor(event.title);
    return { style: { backgroundColor ,
      fontSize: '0.8rem', // Ajusta el tamaño del texto del evento aquí
      padding: '2px' // Puedes ajustar el padding si es necesario
    } };
  };

  return (
    <div className='flex items-center justify-center flex-col overflow-scroll '>
      <Calendar        
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'day']}
        style={{ height: 600, width: 800 ,margin:0 }}
        eventPropGetter={eventPropGetter} 
      />
      <br />
      <br />
    </div>
  );
}
