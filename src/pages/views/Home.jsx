import 'animate.css';
export const Home = () => {
  return (
    <div className=' h-full relative animate__animated animate__fadeIn'>
        <img src="/images/ASESORES.png" alt="fondoHome" className="absolute inset-0 w-full h-full object-cover" />
        <img src="/images/LOGO BLANCO.png" alt="logo" className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};