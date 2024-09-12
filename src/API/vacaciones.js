import axios from "./axios.js";


export const listarMisSolicitudesRequest = (id) => {
    const solicitudesAprobadas = axios.get(`/obtenerSolicitudes/${id}`, { withCredentials: true });
    const solicitudesPendientes = axios.get(`/obtenerSolicitudesEnProceso/${id}`, { withCredentials: true });
  
    return Promise.allSettled([solicitudesAprobadas, solicitudesPendientes])
      .then((results) => {
        const aprobadasResponse = results[0];
        const pendientesResponse = results[1];
  
        const aprobadasData = aprobadasResponse.status === 'fulfilled' && aprobadasResponse.value.data.data ? aprobadasResponse.value.data.data : [];
        const pendientesData = pendientesResponse.status === 'fulfilled' && pendientesResponse.value.data.data ? pendientesResponse.value.data.data : [];
  
        // Combina las respuestas en un solo array
        const combinadas = [...aprobadasData, ...pendientesData];
        console.log(combinadas);
        return combinadas; // Devuelve el array combinado
      })
      .catch(error => {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
      });
  };