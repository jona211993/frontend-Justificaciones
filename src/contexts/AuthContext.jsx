import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../API/auth.js";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth  debe ser usado con un AuthProvider");
  }
  return context;
};
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {

  const [user, setUser] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [errores, setErrores] = useState([]);
  const [idJust, setIdJust] = useState();

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setAutenticado(true);
    } catch (error) {
      console.log(error);
    }
  };

  const signIn = async (user) => {
    try {
      const res = await loginRequest(user);
      // console.log('esto esta en data');
      // console.log(res.data.user);
      setUser(res.data);
      setAutenticado(true);
    } catch (error) {
      console.log(error.response);
      setErrores(error.response.data);
    }
  };
 
  useEffect(() => {
     const cookies = Cookies.get()  
     if(cookies.token){
        console.log(cookies.token)
     }
    
  }, [])
  
  return (
    <AuthContext.Provider
      value={{
        signup,
        signIn,
        user,
        autenticado,
        errores,
        idJust,setIdJust,
        setErrores,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
