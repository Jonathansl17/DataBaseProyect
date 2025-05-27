"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Entrenador from "@/types/entrenador"
import SesionSinEntrenador from "@/types/sesionUnica"

export default function AsignarEntrenadorPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [sesiones, setSesiones] = useState<SesionSinEntrenador[]>([])
  const [selectedEntrenador, setSelectedEntrenador] = useState("")
  const [selectedSesion, setSelectedSesion] = useState("")

  // 🚀 Cargar entrenadores y sesiones sin entrenador
  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const res = await fetch("http://localhost:3100/consultas/entrenadores")
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setEntrenadores(data.data)
        } else {
          throw new Error("Formato inválido de entrenadores")
        }
      } catch (error) {
        toast.error("Error al cargar entrenadores")
      }
    }

    const fetchSesiones = async () => {
      try {
        const res = await fetch("http://localhost:3100/entrenadores/vistaSesionesSinEntrenador")
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          const sesionesFormateadas = data.data.map((s: any) => ({
            id: s.id_sesion_programada,
            descripcion: `${s.nombre_clase} - ${s.fecha.slice(0, 10)} (${s.hora_inicio.slice(11, 16)} - ${s.hora_fin.slice(11, 16)}) - Grupo ${s.numero_grupo}`
          }))
          setSesiones(sesionesFormateadas)
        } else {
          throw new Error("Formato inválido de sesiones sin entrenador")
        }
      } catch (error) {
        toast.error("Error al cargar sesiones sin entrenador")
      }
    }

    fetchEntrenadores()
    fetchSesiones()
  }, [])

  // ✅ Asignar entrenador a sesión
  const asignarEntrenador = async () => {
    try {
      const res = await fetch("http://localhost:3100/entrenadores/asignarEntrenadorASesionProgramada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula_entrenador: selectedEntrenador,
          id_sesion_programada: parseInt(selectedSesion)
        })
      })

      if (res.ok) {
        toast.success("Entrenador asignado con éxito")
        setSelectedEntrenador("")
        setSelectedSesion("")
      } else {
        const msg = await res.text()
        toast.error(msg)
      }
    } catch (error) {
      toast.error("Error al asignar entrenador")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Asignar Entrenador</h1>
      <p className="text-muted-foreground">Asigna un entrenador a una sesión programada sin asignación previa</p>

      <Card>
        <CardHeader>
          <CardTitle>Formulario</CardTitle>
          <CardDescription>Selecciona un entrenador y una sesión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Entrenador */}
          <div>
            <Label>Entrenador</Label>
            <Select value={selectedEntrenador} onValueChange={setSelectedEntrenador}>
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Seleccionar entrenador" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md border border-gray-200 rounded-md">
                {entrenadores.map((e) => (
                  <SelectItem key={e.cedula} value={e.cedula}>
                    {e.cedula} - {e.nombre} {e.apellido1} {e.apellido2} ({e.tipo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Sesión */}
          <div>
            <Label>Sesión Programada</Label>
            <Select value={selectedSesion} onValueChange={setSelectedSesion}>
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder="Seleccionar sesión" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black shadow-md border border-gray-200 rounded-md">
                {sesiones.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.descripcion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={asignarEntrenador}
            disabled={!selectedEntrenador || !selectedSesion}
          >
            Asignar Entrenador
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
