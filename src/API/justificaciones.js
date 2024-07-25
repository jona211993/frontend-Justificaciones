import axios from "./axios.js";
export const asesoresBySuperRequest = (grupo) => {

  console.log("estes es grupo + "+grupo)
    // Define los datos que deseas enviar en el cuerpo
    const data = {
      grupo: grupo
    };
    console.log("estes es data + "+data.grupo)
    // Realiza la petición POST con Axios
    return axios.post('/obtenerAsesoresPorSuper', data)
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

  //? Para las justificaciones
  export const justificacionesByIdGrupoRequest = (grupo, cargo) => {

    console.log("estes es grupo  "+grupo)
    console.log("estes es cargo  "+cargo)
      // Define los datos que deseas enviar en el cuerpo
      const data = {
        grupo: grupo,
        cargo: cargo
      };
      console.log("estes es data + "+data.grupo)
      // Realiza la petición POST con Axios
      return axios.post('/obtenerJustsPorSuper', data)
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

    export const listarJustificacionesRequest = () => {     
        // Realiza la petición POST con Axios
        return axios.get('/obtenerJustificaciones')
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

      export const datosJustificacionRequest = (id) => {     
        // Realiza la petición POST con Axios
        return axios.get(`/obtenerJustifPorID/${id}`, {withCredentials: true})
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
  // Para eliinar la justif:
  export const eliminarJustificacionRequest = (id) => {     
    // Realiza la petición POST con Axios
    return axios.delete(`/eliminarJustifPorID/${id}`)
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

  //PAra editar las justificaciones:
  export const editarJustificacionRequest = (id,datos) => {     
    // Realiza la petición POST con Axios
    console.log(id,datos.descuento,datos.penalidad)
    return axios.put(`/editarJustifPorID/${id}`, datos)
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


 // Para poder obtener las pruebas de una justificacion
      export const pruebasDeJustificacionRequest = (id) => {     
        // Realiza la petición POST con Axios
        return axios.get(`/obtenerPruebas/${id}`)
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