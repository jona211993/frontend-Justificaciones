import Form from '../components/Form'
import Nav from '../components/Nav'

function LoginPage() {
  return (
    <>
    <Nav></Nav>
     <div className='flex w-full h-screen'>
      <div className='w-full flex items-center justify-center lg:w-1/2 bg-gray-100'>
        <Form/>
      </div>
      <div className='hidden lg:flex h-full w-1/2 bg-cyan-800 items-center justify-center'>
        <div className="bg-icono-portada w-96 h-3/6 bg-no-repeat">            
        </div>
      </div>
    </div>
    </>
    
  )
}

export default LoginPage