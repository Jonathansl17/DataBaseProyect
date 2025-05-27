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

interface Entrenador {
  cedula: string
  nombre: string
  apellido1: string
  apellido2: string
  tipo: string
}

interface SesionUnica {
  id: number
  descripcion: string
}

export default function AsignarEntrenadorPage() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [sesiones, setSesiones] = useState<SesionUnica[]>([])
  const [selectedEntrenador, setSelectedEntrenador] = useState("")
  const [selectedSesion, setSelectedSesion] = useState("")

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
        const res = await fetch("http://localhost:3100/clientes/vistaClientesSesion")
        const data = await res.json()
        if (data.success && Array.isArray(data.tables[0])) {
          const sesionesUnicas = Array.from(
            new Map(
              data.tables[0].map((s: any) => [
                s.id_sesion_programada,
                {
                  id: s.id_sesion_programada,
                  descripcion: `${s.nombre_clase} - ${s.fecha_sesion.slice(0, 10)} (${s.hora_inicio.slice(11, 16)} - ${s.hora_fin.slice(11, 16)}) - Grupo ${s.numero_grupo}`
                },
              ])
            ).values()
          )
          setSesiones(sesionesUnicas)
        } else {
          throw new Error("Formato inválido de sesiones")
        }
      } catch (error) {
        toast.error("Error al cargar sesiones")
      }
    }

    fetchEntrenadores()
    fetchSesiones()
  }, [])

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
      <p className="text-muted-foreground">Asigna un entrenador a una sesión programada</p>

      <Card>
        <CardHeader>
          <CardTitle>Formulario</CardTitle>
          <CardDescription>Selecciona un entrenador y una sesión</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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