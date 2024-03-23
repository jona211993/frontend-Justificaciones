import { BrowserRouter,Routes,Route } from "react-router-dom"
import RegistroPage from "./pages/RegistroPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<h1>Home</h1>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/registrar" element={<RegistroPage/>}/>
      <Route path="/home" element={<h1>Home</h1>}/>
      <Route path="/justificaciones" element={<h1>Justificaciones</h1>}/>
      <Route path="/justificaciones/:id" element={<h1>Justificaciones por id</h1>}/>
    </Routes>
    
    </BrowserRouter>

    
  )
 
}

export default App
