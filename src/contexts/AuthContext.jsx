import { createContext, useContext, useState } from "react";
import { loginRequest, registerRequest } from "../API/auth.js";

export const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
       throw new Error("useAuth  must be used within an AuthProvider")
    }
    return context;
} 

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user , setUser] = useState(null);
    const [autenticado, setAutenticado] = useState(false);

    const signup = async(user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setAutenticado(true);
        } catch (error) {
            console.log(error);
        }      
    }

    const signIn = async(user) => {
        try {
            const res = await loginRequest(user);
            console.log(res.data);
            setUser(res.data);
            setAutenticado(true);
        } catch (error) {
            console.log(error);
        }      
    }

    return (
        <AuthContext.Provider value={{
            signup,
            signIn,
            user,
            autenticado
        }}>
            {children}
        </AuthContext.Provider>
    )

}
