import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";


function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn, autenticado, errores, setErrores } = useAuth();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    // Mostrar el modal si hay errores
    if (errores.length > 0) {
      setModalVisible(true);
      const timer = setTimeout(() => {
        setModalVisible(false);
        setErrores([]);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setModalVisible(false);
    }

    // Redireccionar si el usuario está autenticado
    if (autenticado) {
      setErrores([]);
      navigate("/expertisRH");
      
    }
  }, [autenticado,errores, setErrores]);

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  // Creamos la funcion que traera el post de auht
  const onSubmit = handleSubmit((data) => {
    setErrores([]);
    signIn(data);
  });

  return (
    <div className="bg-white rounded-3xl px-10 py-16 border-2 border-gray-100 h-3/5">
      <Modal
        title="Errores"
        open={modalVisible}
        onCancel={cerrarModal}
        footer={null}
        centered
        closable={false}
        style={{ borderRadius: "10px" }}
      >
        {errores.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
      </Modal>

      <h1 className="text-5xl font-semibold"> Bienvenido de nuevo</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Por favor, ingresa tus credenciales
      </p>
      <div className="mt-6 flex items-center justify-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex flex-col items-start justify-center w-96 h-72"
        >
          <label className="text-lg font-medium">Usuario</label>
          <input
            type="text"
            {...register("usuario", { required: true })}
            className=" border-2 border-gray-100 w-full rounded-xl p-3 mt-1 mb-6 bg-transparent"
            placeholder="Alias"
          />
          {errors.usuario && (
            <p className="text-red-500">Usuario es requerido</p>
          )}
          <label className="text-lg font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="border-2 border-gray-100 w-full rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Contraseña"
          />
          {errors.password && (
            <p className="text-red-500">Ingrese una contrasena</p>
          )}
          <div className="mt-8 flex items-center justify-center gap-y-4 w-full">
            <button
              type="submit"
              className=" active:scale-95 active:duration-75 hover:scale-[1.01] transition-all w-full bg-cyan-800 text-white rounded-xl py-3 m-5 text-lg font-bold "
            >
              {" "}
              Iniciar Sesion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
