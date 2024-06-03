import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { datosJustificacionRequest , pruebasDeJustificacionRequest } from "../../API/justificaciones";
import { Descriptions } from "antd";
import { Image } from 'antd';
import 'animate.css';

export const VerJustificacion = () => {
  const { idJust } = useAuth();
  const [data, setData] = useState(null); // Estado para almacenar los datos
  const [pruebas, setPruebas] = useState([]);
  useEffect(() => {
    const obtenerDatosJustificacion = async () => {
      try {
        const response = await datosJustificacionRequest(idJust);
        setData(response.data4[0]); // Almacena los datos en el estado
      } catch (error) {
        console.error("Hubo un error al obtener las justificaciones:", error);
      }
    };

    const obtenerPruebasJustificacion = async () => {
      try {
        const response = await pruebasDeJustificacionRequest(idJust);
        setPruebas(response.data); // Almacena los datos en el estado
      } catch (error) {
        console.error("Hubo un error al obtener las pruebas de la justificacion", error);
      }
    };

    if (idJust) {
      obtenerDatosJustificacion(); // Llama a obtenerDatosJustificacion() solo si idJust está disponible
      obtenerPruebasJustificacion();
    }
  }, [idJust]);

  function formatearFecha(CadenaFecha) {
    // Tomar los primeros 10 caracteres de la cadena de fecha
    const fechaCortada = CadenaFecha.slice(0, 10);

    // Retornar los primeros 10 caracteres como resultado
    return fechaCortada;
  }

  // para la tabla:
  function obtenerItems() {
    if (data) {
      const items = [
        {
          label: "Asesor",
          children: data.asesor,
        },
        {
          label: "Fecha",
          children: formatearFecha(data.fecha),
        },
        {
          label: "Nivel 1",
          children: data.nivel1,
        },
        {
          label: "Nivel 2",
          children: data.nivel2,
        },
        {
          label: "Nivel 3",
          children: data.nivel3,
        },

        {
          label: "Penalidad",
          children: data.penalidad,
        },
        {
          label: "Descuento",
          children: data.descuento,
        },
        {
          label: "Descripccion",
          children: data.descripcion,
        },
        {
          label: "Minutos Permiso",
          children: data.minutos_permiso,
        },
        {
          label: "Creado por:",
          children: data.user_create,
        },
        {
          label: "Modificad Por:",
          children: data.user_update,
        },
        {
          label: "Fecha de modificacion",
          children: data.fec_update,
        },
        {
          label: "Observacion",
          children: data.observacion,
        },
      ];
      return items;
    }
  }
  return (
    <div className=" overflow-scroll h-full animate__animated animate__fadeInTopRight">
      <div>
        <h1
          style={{ color: "#053B50" }}
          className="text-xl  text-center font-bold font-roboto p-5  md:text-5xl md:text-center"
        >
          Detalle de la Justificacion
        </h1>
      </div>
      {/* Para la tabla con detalle de la just */}
      <div className="p-8">
        {/* Muestra los datos solo si están disponibles */}
        {data && (
          <Descriptions
            bordered
            column={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            items={obtenerItems()}
            style={{ color: "red" }}
          />
        )}
      </div>
      <h2 className="text-2xl font-bold text-cyan-900 w-full p-3">Pruebas: </h2>
      {/* Contenedor de las imagenes */}
      <div className="flex p-2 gap-4 items-center justify-center flex-wrap  ">
      {pruebas.map((prueba) => (
        <Image
          key={prueba.id}
          width={200}
          src={prueba.urlPrueba}
        />
      ))}

      </div>
      <div>
        
      </div>
        <footer>
          <br />
          <br />
          <br />
        </footer>
    </div>
  );
};
