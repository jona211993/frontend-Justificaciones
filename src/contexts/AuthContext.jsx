import { createContext, useContext, useState } from "react";
import { registerRequest } from "../API/auth.js";

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth  must be used within an AuthProvider")
    }
    return context;
} 

export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null);
    const [autenticado, setAutenticado] = useState(false);


    const signup = async(user) => {
        try {
            const res = await registerRequest(user);
            console.log(res.data);
            setUser(res.data);
            setAutenticado(true);
        } catch (error) {
            console.log(error)
        }
      
    }
    return (
        <AuthContext.Provider value={{
            signup,
            user,
            autenticado
        }}>
            {children}
        </AuthContext.Provider>
    )

}
