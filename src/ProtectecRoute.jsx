import {Navigate, Outlet} from 'react-router-dom'
import { useAuth } from "./contexts/AuthContext"

const ProtectecRoute = () => {
const {user, autenticado} = useAuth();
if(!autenticado) return <Navigate to='/login' replace/>

return (
   <Outlet/>
  )
}

export default ProtectecRoute