"use client"

import Link from "next/link";
import { useState } from "react";

type DatosType = {
    mensaje?: string;
};

const OtraPagina = () => {
    const [Datos, setDatos] = useState<DatosType>({})

    const hacerFetchAlBackend = async()=>{
        try{
            const response = await fetch("http://localhost:3100/hello")
            const data = await response.json()
            setDatos(data)
        }catch(error ){
            console.error(error)
        }
    }

    const desconectar = async()=>{
        try{
            const response = await fetch("http://localhost:3100/connection/disconnect",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

        }catch(error ){
            console.error(error)
        }
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg mb-4">Esta es otra página de la aplicación.</p>

            
            {Datos.mensaje
            ? <p>{Datos.mensaje}</p>
            : <p>Click al botón para mostrar datos del backend</p>}

            <button className="bg-blue-500 text-white px-4 py-2 rounded mb-30"
             onClick={hacerFetchAlBackend}>
                Click para hacer fetch al backend
            </button>

            <Link href="/">
                <button className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={desconectar}>
                    Volver a la página principal
                </button>
            </Link>
        </div>
    )
}

export default OtraPagina;