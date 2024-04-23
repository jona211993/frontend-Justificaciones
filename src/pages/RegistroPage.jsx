import { useAuth } from "../contexts/AuthContext.jsx"; 
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/formRegistro.css";

function RegistroPage() {
  // de la libreria useForm
  const { register, handleSubmit, formState: {errors}} = useForm();
 // Para el context
 const {signup, autenticado} = useAuth();
 const navigate = useNavigate();

 useEffect(() => { 
   return () => {
     if(autenticado) navigate("/inicio")
   }
 }, [autenticado])
 

  // Creamos la funcion que traera el ppost de auht
  const onSubmit = handleSubmit(async (values) => {
   signup(values);
  });

  // para darle formato a la fecha
  function getCurrentDate() {
    const today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; // Los meses van de 0 a 11, así que sumamos 1
    const year = today.getFullYear();

    // Agregamos un '0' al inicio si el día o el mes es menor que 10
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    return `${year}-${month}-${day}`;
  }

  
  
  return (
    <div className="contenedor-global">
      <div className="cont-portada">
        <div className="imagen-portada">
        </div>
      </div>
      <div className="cont-formulario">
        <div>
          <h1>Registrar Usuario</h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="formulario"
        >
         
          <input
            type="text"
            {...register("nombre", { required: true })}
            className="input"
            placeholder="Nombre"
          />
          {
            errors.nombre && (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="text"
            {...register("apellido1", { required: true })}
            className="input"
            placeholder="Apellido Paterno"
          />
          {
            errors.apellido1 && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="text"
            {...register("apellido2", { required: true })}
            className="input"
            placeholder="Apellido Materno"
          />
          {
            errors.apellido2 && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="text"
            {...register("telefono", { required: true })}
            className="input"
            placeholder="Telefono"
          />
          {
            errors.telefono && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="text"
            {...register("direccion", { required: true })}
            className="input"
            placeholder="Direccion"
          />
          {
            errors.direccion && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="text"
            {...register("dni", { required: true })}
            className="input"
            placeholder="DNI"
          />
          {
            errors.dni && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="text"
            {...register("usuario", { required: true })}
            className="input"
            placeholder="Alias"
          />
          {
            errors.usuario && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <input
            type="password"
            {...register("password", { required: true })}
            className="input"
            placeholder="Contraseña"
          />
          {
            errors.password && 
            (<p className="text-red-500"> Este campo es requerido</p>)
          }
          <div className="cont-fecha-cargo">
            <input
              type="date"
              {...register("fec_ingreso", { required: true })}
              className="input"
              defaultValue={getCurrentDate()}
            />
            {
            errors.fec_ingreso && 
            (<p className="text-red-500"> Este campo es requerido</p>)
            }
            <select {...register("id_cargo", { require: true })}>
            <option value="1">ADMIN</option>  
            <option value="2">JEFE AREA</option>  
            <option value="3">ASISTENTE RRHH</option>               
            </select>
            
          </div>

          <button type="submit" className="button">
            {" "}
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistroPage;
