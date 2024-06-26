import  { useState } from 'react'
import { Button } from './button.jsx';

function Nav() {
 let Links= [
    {name: 'Home', link: "/"},
    {name: 'About', link: "https://www.goexpertis.com"},   
    
 ];

 let [open , setOpen] = useState(false)
  return (
    <div className='shadow-md w-full fixed top-0 left-0 '>
        <div className='md:flex items-center justify-between bg-cyan-950 py-4 md:px-10 px-7 ' >
            <div className='flex flex-row gap-6 font-bold text-2xl cursor-pointer felx items-center font-[Poppins] text-gray-100'>
                <span className='text-3xl text-white mr-1 pt-2'>
                <img src="/images/icono-logo.png" alt="logo" />
                </span>
                Expertis
            </div>
            <div onClick={()=> setOpen(!open)} className='text-3xl absolute right-8 top-6 cursor-pointer md:hidden'>
            <ion-icon name={open ? 'close' : 'menu'  }></ion-icon>
            </div>
            <ul className={`md:flex md:items-center md:pb-0 pb-8 absolute md:static bg-cyan-950 
            md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-400 
            ease-in ${open ? 'top-20 opacity-100' : 'top-[-490px]'}`}>
               {
                Links.map((link)=> (
                    <li key={link.name} className='md:ml-8 text-xl md:my-0 my-7'>
                        <a href={link.link} className='text-white hover:text-gray-400 duration-500'>{link.name}</a> 
                        
                    </li>
                ))
               }
               <Button to="/login"> Login </Button>
            </ul>
        </div>
        
    </div>
  )
}

export default Nav