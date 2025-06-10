"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()

  const cerrarSesion = async () => {
    const response = await fetch("http://localhost:3100/connection/disconnect", {
      method: "POST",
    })

    if (response.ok) {
      localStorage.removeItem("toastMaquinasMostrado")
      localStorage.removeItem("toastSesionesMostrado")
      router.push("/")
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-transparent backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div />
        <button
          onClick={cerrarSesion}
          className="text-gray-800 hover:text-black font-medium transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
