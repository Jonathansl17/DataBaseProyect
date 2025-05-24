"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"
import { Clase } from "@/types/clase"
import { Persona } from "@/types/persona"
import ClientCard from "./clientCard"
import { toast } from "sonner"


export default function InscripcionesPage() {
  const [cedula, setCedula] = useState("")
  const [persona, setPersona] = useState<Persona | null>(null)
  const [clases, setClases] = useState<Clase[]>([])
  const [claseSeleccionada, setClaseSeleccionada] = useState<number | null>(null)

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
        toast.error("Error al cargar clases.")
      }
    }

    fetchClases()
  }, [])

  const buscarPersona = async () => {
    if (cedula.trim().length !== 9) {
      toast.error("La cédula debe tener exactamente 9 dígitos.")
      setPersona(null)
      return
    }

    try {
      const response = await fetch(`http://localhost:3100/consultas/cliente/${cedula.trim()}`)
      const data = await response.json()
      if (data.success) {
        setPersona(data.data)
      } else {
        setPersona(null)
        toast.error(`No se encontró ningún cliente con la cédula ${cedula}`)
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error)
      setPersona(null)
      toast.error("Ocurrió un error al buscar el cliente.")
    }
  }

  const tieneMembresiaActiva = () => {
    if (!persona) return false
    if (!persona.tipo_membresia || !persona.fecha_expiracion) return false

    const hoy = new Date()
    const fechaExp = new Date(persona.fecha_expiracion)
    return fechaExp >= hoy
  }

  const handleInscripcion = async () => {
    if (!persona || !claseSeleccionada) {
      toast.error("Debe seleccionar una clase y haber buscado una persona válida.")
      return
    }

    try {
      const response = await fetch("http://localhost:3100/clases/asignarClase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: persona.cedula, id_clase: claseSeleccionada }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        toast.success("✅ Inscripción exitosa")
        setCedula("")
        setPersona(null)
        setClaseSeleccionada(null)
      } else {
        toast.error("No se pudo completar la inscripción. Intenta nuevamente.")
      }
    } catch (error) {
      console.error("Error al inscribir:", error)
      toast.error("Ocurrió un error en el servidor.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 mx-10 mt-5">
      {/* Formulario principal */}
      <div className="flex-1 space-y-6 max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight">Inscripciones</h1>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Inscribir cliente a una clase</h2>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ej: 123456789"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
            </div>
            <Button className="h-[42px] mt-[22px]" onClick={buscarPersona}>
              Buscar persona
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Clases disponibles</Label>

            {persona && !tieneMembresiaActiva() && (
              <p className="text-red-600 text-sm">
                El cliente no tiene una membresía activa. No puede inscribirse en clases.
              </p>
            )}

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
                    disabled={isDisabled || !persona || !tieneMembresiaActiva()}
                    className={`relative w-full text-left px-5 py-3 rounded-lg border transition font-medium
                      ${isSelected
                        ? "bg-primary text-white border-primary shadow-lg ring-2 ring-primary"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}
                      ${isDisabled || !persona || !tieneMembresiaActiva()
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"}`}
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

          <Button
            className="w-full mt-4"
            onClick={handleInscripcion}
            disabled={!persona || !claseSeleccionada || !tieneMembresiaActiva()}
          >
            Inscribir
          </Button>
        </div>
      </div>

      {persona && (
        <ClientCard
          persona={persona}
          mt={32}
        />
      )}

    </div>
  )
}
