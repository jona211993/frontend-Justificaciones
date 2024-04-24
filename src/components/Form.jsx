import { useForm } from "react-hook-form";
// import { registerRequest } from "../API/auth.js";

function Form() {
  const { register, handleSubmit} = useForm();
  // Creamos la funcion que traera el ppost de auht
  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    // const res = await registerRequest(values);
    // console.log(res);
  });

  return (
    <div className="bg-white rounded-3xl px-10 py-16 border-2 border-gray-100 h-3/5">
      <h1 className="text-5xl font-semibold"> Bienvenido de nuevo</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Por favor, ingresa tus credenciales
      </p>
      <div className="mt-6 flex items-center justify-start" >
        <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col items-start justify-center w-96 h-72">
          <label className="text-lg font-medium">Usuario</label>
          <input
            type="text"
            {...register("usuario", { require: true })}
            className=" border-2 border-gray-100 w-full rounded-xl p-3 mt-1 mb-6 bg-transparent"
            placeholder="Alias"
          />
          <label className="text-lg font-medium">Password</label>
          <input
            type="password"
            {...register("password", { require: true })}
            className="border-2 border-gray-100 w-full rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Contraseña"
          />
          <div className="mt-8 flex items-center justify-center gap-y-4 w-full">
            <button type="submit" className=" active:scale-95 active:duration-75 hover:scale-[1.01] transition-all w-full bg-cyan-800 text-white rounded-xl py-3 m-5 text-lg font-bold ">
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
