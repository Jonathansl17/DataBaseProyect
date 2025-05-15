import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
          <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold mb-4">Bienvenido a la Aplicación de Base de Datos</h1>

              <Link href="/otrapagina">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Ir a otra página
                  </button>
              </Link>
          </div>
      );
}
