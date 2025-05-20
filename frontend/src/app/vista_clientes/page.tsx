"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DatosType = {
  tables?: Array<Array<Record<string, any>>>;
};

const OtraPagina = () => {
  const router = useRouter();
  const [Datos, setDatos] = useState<DatosType>({});

  useEffect(() => {
    const isConnected = localStorage.getItem("sqlConnection");
    if (!isConnected) {
      router.push("/");
    }
  }, []);

  const vista_clientes = async () => {
    console.log("Fetching data from backend...");
    try {
      const response = await fetch("http://localhost:3100/views/vista_clientes");
      const data = await response.json();
      setDatos(data);
      console.log("Data received:", data);
    } catch (error) {
      console.error(error);
    }
  };

  const desconectar = async () => {
    console.log("Disconnecting...");
    try {
      const desconec = await fetch("http://localhost:3100/connection/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await desconec.json();
      if (result.success) {
        localStorage.removeItem("sqlConnection");
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg mb-4">Esta es otra página de la aplicación.</p>
      <p className="text-lg mb-4">
        Si ven la ruta arriba es http://localhost:3000/vista_clientes por el app router que ofrece Next.js.
      </p>

      {Datos.tables && Datos.tables.length > 0 && Datos.tables[0].length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Clientes</h2>
          <table className="border-collapse border border-gray-300">
            <thead>
              <tr>
                {Object.keys(Datos.tables[0][0]).map((key) => (
                  <th key={key} className="border px-4 py-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Datos.tables[0].map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={vista_clientes}
      >
        Click para hacer fetch al backend
      </button>

      <Link href="/">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={desconectar}
        >
          Volver a la página principal
        </button>
      </Link>
    </div>
  );
};

export default OtraPagina;
