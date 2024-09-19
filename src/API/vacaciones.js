import axios from "./axios.js";

export const listarMisSolicitudesRequest = async (id) => {
    try {
        const solicitudesAprobadas = axios.get(`/obtenerSolicitudes/${id}`, { withCredentials: true });
        const solicitudesPendientes = axios.get(`/obtenerSolicitudesEnProceso/${id}`, { withCredentials: true });

        const results = await Promise.allSettled([solicitudesAprobadas, solicitudesPendientes]);

        const aprobadasData = results[0].status === 'fulfilled' && results[0].value.data.data
            ? results[0].value.data.data
            : [];
        
        const pendientesData = results[1].status === 'fulfilled' && results[1].value.data.data
            ? results[1].value.data.data
            : [];

        console.log("El estado de aprobadas =", results[0].status, results[0].value?.data?.data);
        console.log("El estado de en proceso =", results[1].status, results[1].value?.data);

        // Combina las respuestas en un solo array
        const combinadas = [...aprobadasData, ...pendientesData];
        console.log(combinadas);
        return combinadas; // Devuelve el array combinado

    } catch (error) {
        // Maneja errores que no sean de las solicitudes individuales
        console.error('Hubo un error general:', error);
        throw error; 
    }
};
