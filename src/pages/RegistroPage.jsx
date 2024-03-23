import React from 'react';
import {useForm} from  'react-hook-form';
import {registerRequest} from '../API/auth.js';

import "../styles/formRegistro.css";

function RegistroPage() {
    // de la libreria useForm
    const {register, handleSubmit} = useForm();
  // Creamos la funcion que traera el ppost de auht
  const onSubmit = handleSubmit(async(values) => {
      const res= await registerRequest(values);
      console.log(res);
  });



  return (
    <div className='cont-formulario'>
        <h1>Registrar Usuario</h1>
        <form onSubmit={handleSubmit((values)=> {
            console.log(values);
        })} className='formulario'>
            <input type="text" {... register('username' , {require: true})} className='input' placeholder='Ususario' />
            <input type="email"  {... register('email' , {require: true})} className='input' placeholder='Coreo' />
            <input type="password"  {... register('password' , {require: true})} className='input' placeholder='Contraseña'/>
            <button type='submit'> Registrar</button>
            
        </form>    
        
    </div>
  )
}

export default RegistroPage