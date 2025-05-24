"use client"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"


export function Header() {
  const router = useRouter();

  const cerrarSesion = async () => {
    const response = await fetch("http://localhost:3100/connection/disconnect", {
      method: "POST",
    });

    if (response.ok) {
      console.log("Desconectado");
      router.push("/");
    }
  }
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
          variant="ghost" 
          size="icon"
          onClick={() => cerrarSesion()}
          >
            <p className="text-gray-600 mr-15">Cerrar sesión</p>
          </Button>
        </div>
      </div>
    </header>
  )
}
