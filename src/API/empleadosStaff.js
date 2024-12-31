import axios from "./axios.js";

export const listarEmpleadosStaffRequest = () => {     
    // Realiza la petición POST con Axios
    return axios.get(`/obtenerEmpleadosStaff`, {withCredentials: true})
      .then(response => {
        // Maneja la respuesta aquí
        // console.log(response.data);
        return response.data; // Si necesitas devolver los datos
      })
      .catch(error => {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
      });
  };