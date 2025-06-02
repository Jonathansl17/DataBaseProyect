"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  ArrowLeft, CalendarPlus, CheckCircle
} from "lucide-react"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import Link from "next/link"

type Sesion = {
  id_sesion: number
  nombre_clase: string
  descripcion_clase: string
  numero_grupo: number
  dia: string
  hora_inicio: string
  hora_fin: string
}

export default function CrearSesionPage() {
  const [sesiones, setSesiones] = useState<Sesion[]>([])
  const [idSesion, setIdSesion] = useState<string>("")
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0])
  const [estado, setEstado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        //Cambie este por detalles, eran las mismas
        const res = await fetch("http://localhost:3100/sesiones/vistaDetallesSesion") 
        const data = await res.json()
        if (data.success && Array.isArray(data.tables?.[0])) {
          setSesiones(data.tables[0])
        } else {
          throw new Error("Datos de sesiones inválidos")
        }
      } catch (err) {
        console.error("Error cargando sesiones:", err)
        setError("No se pudieron cargar las sesiones.")
      }
    }

    fetchSesiones()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setEstado(null)
    setError(null)

    if (!idSesion || !fecha) {
      setError("Todos los campos son obligatorios.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:3100/sesiones/crearSesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_sesion: Number(idSesion), fecha })
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message || "No se pudo crear la sesión.")
      }

      setEstado("Sesión creada exitosamente.")
      setIdSesion("")
      setFecha(new Date().toISOString().split("T")[0])
    } catch (err: any) {
      setError(err.message || "Error desconocido.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/sesiones">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crear Sesión</h1>
          <p className="text-muted-foreground">Programa una nueva sesión en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nueva Sesión Programada</CardTitle>
          <CardDescription>Selecciona una sesión y la fecha en que se impartirá</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idSesion">Sesión Disponible</Label>
            <Select value={idSesion} onValueChange={setIdSesion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una sesión" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-gray-200 rounded-md">
                {sesiones.map((s) => (
                  <SelectItem key={`sesion-${s.id_sesion}`} value={s.id_sesion.toString()}>
                    {`${s.nombre_clase} | ${s.dia} ${new Date(s.hora_inicio).toLocaleTimeString("es-CR", {
                      hour: "2-digit", minute: "2-digit"
                    })} - ${new Date(s.hora_fin).toLocaleTimeString("es-CR", {
                      hour: "2-digit", minute: "2-digit"
                    })} | Grupo ${s.numero_grupo}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="flex justify-start pt-4">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creando..." : (
                <>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Crear Sesión
                </>
              )}
            </Button>
          </div>

          {estado && (
            <div className="flex items-center gap-2 text-green-600 mt-2">
              <CheckCircle className="w-5 h-5" />
              <span>{estado}</span>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
