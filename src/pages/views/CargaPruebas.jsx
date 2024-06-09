import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../contexts/AuthContext";

export const CargaPruebas = () => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const { idJust } = useAuth();

  const onDrop = useCallback((newFiles) => {
    if (acceptedFiles.length + newFiles.length > 4) {
      setErrorMessage("Solo se pueden cargar hasta 4 archivos.");
      return;
    }

    setErrorMessage("");
    setAcceptedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, [acceptedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 4,
    onDropRejected: () => {
      setErrorMessage("Solo se permiten archivos de imagen (PNG, JPG, JPEG).");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    },
  });

  const handleRemoveFile = (file) => {
    setAcceptedFiles(acceptedFiles.filter((f) => f !== file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const uploadPromises = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "zjilxjgo");
      formData.append("api_key", "348638695531547");
      formData.append("folder", "EXPERTIS");

      const res = await fetch(
        import.meta.env.VITE_CLOUDINARY_URL,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setFileUrls(urls);
      setIsUploaded(true);
    } catch (error) {
      setErrorMessage("Error al cargar los archivos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleSave = async () => {
    // Aquí envías cada URL al backend individualmente para guardarlas en la base de datos
    try {
        console.log(fileUrls);
      for (const url of fileUrls) {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/crearPrueba`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_justificacion: idJust ,urlPrueba: url }),
        });
  
        if (!response.ok) {
          throw new Error("Error al guardar la URL en la base de datos.");
        }
      }
  
      // Manejar la respuesta del servidor
      console.log("URLs guardadas exitosamente en la base de datos.");
    } catch (error) {
      setErrorMessage("Error al guardar las URLs. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="h-full  ">
      <h1 className="text-xl text-cyan-900  text-center font-bold font-roboto p-3 md:text-5xl md:text-center">
        Carga las pruebas de la justificación
      </h1>
      <form
        className="h-full flex flex-col items-center p-5 gap-9 "
        onSubmit={handleSubmit}
      >
        {!isUploaded && acceptedFiles.length < 4 && (
          <div
            className="bg-gray-400 border-4 rounded-2xl border-gray-700 border-dotted p-3 w-2/4 h-1/4 flex items-center text-slate-200 justify-center"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Suelta los archivos aquí ...</p>
            ) : (
              <p>Arrastra tu imagen de la prueba aquí</p>
            )}
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded">
              <p>Solo se permiten archivos de imagen (PNG, JPG, JPEG).</p>
            </div>
          </div>
        )}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        <div className="flex flex-wrap gap-3 w-4/6 h-2/5 p-6  items-start justify-between  ">
          {acceptedFiles.map((file, index) => (
            <div key={index} className="relative w-1/4 h-2/4 ">
              <img
                className="w-full h-full rounded-2xl"
                src={URL.createObjectURL(file)}
                alt={`prueba cargada ${index + 1}`}
              />
              {fileUrls[index] && (
                <span className="absolute top-0 right-0 bg-green-500 text-white rounded-full p-1">
                  ✓
                </span>
              )}
              {!fileUrls[index] && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
        {!isUploaded && (
          <button type="submit" className="bg-cyan-800 text-gray-100 w-72">
            Cargar
          </button>
        )}
        {isUploaded && (
          <button
            type="button"
            onClick={handleSave}
            className="bg-green-600 text-white w-72 mt-4"
          >
            Guardar cambios
          </button>
        )}
      </form>
    </div>
  );
};
