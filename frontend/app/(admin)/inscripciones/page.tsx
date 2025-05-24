"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react" 
import { Clase } from "@/types/clase"


export default function InscripcionesPage() {
  const [cedula, setCedula] = useState("")
  const [clases, setClases] = useState<Clase[]>([])
  const [claseSeleccionada, setClaseSeleccionada] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await fetch("http://localhost:3100/consultas/clases")
        const data = await response.json()
        if (data.success) {
          setClases(data.data)
        } else {
          throw new Error("No se pudieron obtener las clases.")
        }
      } catch (error) {
        console.error("Error al cargar clases:", error)
        setMensaje("Error al cargar las clases disponibles.")
      }
    }

    fetchClases()
  }, [])

  const handleInscripcion = async () => {
    if (!cedula || !claseSeleccionada) {
      setMensaje("Por favor, completa todos los campos.")
      return
    }

    try {
      const response = await fetch("http://localhost:3100/clases/asignarClase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, id_clase: claseSeleccionada }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        setMensaje("Inscripción exitosa 🎉")
        setCedula("")
        setClaseSeleccionada(null)
      } else {
        setMensaje("No se pudo completar la inscripción. Intenta nuevamente.")
      }
    } catch (error) {
      console.error("Error al inscribir:", error)
      setMensaje("Ocurrió un error en el servidor.")
    }
  }

  return (
    <div className="space-y-8 max-w-xl mx-10 mt-5">
      <h1 className="text-3xl font-bold tracking-tight">Inscripciones</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Inscribir persona a una clase</h2>

        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input
            id="cedula"
            type="text"
            placeholder="Ej: 123456789"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Clases disponibles</Label>
          <div className="grid gap-3">
            {clases.map((clase) => {
              const isSelected = claseSeleccionada === clase.id_clase
              const isDisabled = claseSeleccionada !== null && !isSelected

              return (
                <button
                  key={clase.id_clase}
                  type="button"
                  onClick={() =>
                    isSelected
                      ? setClaseSeleccionada(null)
                      : setClaseSeleccionada(clase.id_clase)
                  }
                  className={`relative w-full text-left px-5 py-3 rounded-lg border transition font-medium
                    ${isSelected
                      ? "bg-primary text-white border-primary shadow-lg ring-2 ring-primary"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={isDisabled}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{clase.nombre}</div>
                      <div className="text-sm text-muted-foreground">{clase.descripcion}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-white bg-green-600 rounded-full p-0.5" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleInscripcion}>
          Inscribir
        </Button>

        {mensaje && (
          <div className="text-sm mt-2 text-center text-muted-foreground">{mensaje}</div>
        )}
      </div>
    </div>
  )
}
