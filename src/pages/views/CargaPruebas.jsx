import { useState , useCallback } from "react"
import { useDropzone } from "react-dropzone"

export const CargaPruebas = () => {

    // const [file, setFile] = useState();
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles[0])
        // Do something with the files
      }, [])
      const {getRootProps, getInputProps, isDragActive , acceptedFiles} = useDropzone({
        onDrop, accept: {
            'image/png': ['.png'], 
            'image/jpeg': ['.jpg', '.jpeg'] 
          }, maxFiles: 2
    });


    const handleSubmit =async e => {
        e.preventDefault();
        console.log(e.target[0].value)
        // console.log(file)

        const formData = new FormData()
        formData.append('file', acceptedFiles[0])
        formData.append('upload_preset','zjilxjgo')
        formData.append('api_key','348638695531547')

       const res = await fetch('https://api.cloudinary.com/v1_1/dg4qp6im3/image/upload' , 
       {
        method: 'POST',
        body: formData
       })
       const data = await res.json()
       console.log(data)
    }   

    return (    
    <div className="h-full">
        <h1 className="text-xl  text-cyan-900 text-center font-bold font-roboto p-5  md:text-5xl md:text-center">Carga una prueba a la justificación</h1>
        <form className=" h-screen flex flex-col items-center p-5 gap-9" onSubmit={handleSubmit}>
            <input className="w-1/5"  type="text" />
            <div className="bg-slate-800 w-2/4 h-1/4 flex items-center text-slate-200 justify-center" {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Arrastra tu imagen de la prueba aqui</p>
            }
            </div>
            {acceptedFiles[0] && (
                <img className="w-1/4 h-1/4" src={URL.createObjectURL(acceptedFiles[0])} alt="prueba cargada"></img>
            )}
           
            <button className="bg-cyan-800 text-gray-100 w-72">Subir</button>
        </form>
    </div>
    
    
  )
}
