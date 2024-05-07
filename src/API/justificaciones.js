import axios from "./axios.js";
export const asesoresBySuperRequest = (grupo) => {

  console.log("estes es grupo + "+grupo)
    // Define los datos que deseas enviar en el cuerpo
    const data = {
      grupo: grupo
    };
    console.log("estes es data + "+data)
    // Realiza la petición POST con Axios
    return axios.post('/obtenerJustPorSuper', data)
      .then(response => {
        // Maneja la respuesta aquí
        console.log(response.data);
        return response.data; // Si necesitas devolver los datos
      })
      .catch(error => {
        // Maneja los errores aquí
        console.error('Hubo un error:', error);
        throw error; // Si necesitas propagar el error
      });
  };

  export const grupoByIdRequest = (id) => {
    // Define los datos que deseas enviar en el cuerpo
    const data = {
      id_grupo: id
    };
  
    // Realiza la petición POST con Axios
    return axios.post('/obtenerNombreGrupo', data)
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

  