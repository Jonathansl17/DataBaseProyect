"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Sesion } from "@/types/sesion"

export default function SesionesPage() {
  const [sesiones, setSesiones] = useState<Sesion[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const response = await fetch("http://localhost:3100/clientes/vistaClientesSesion")
        const data = await response.json()
        if (data.success && Array.isArray(data.tables) && Array.isArray(data.tables[0])) {
          setSesiones(data.tables[0])
        } else {
          throw new Error("Formato de datos inválido")
        }
      } catch (error) {
        console.error("Error al cargar sesiones:", error)
      }
    }

    fetchSesiones()
  }, [])

  const sesionesFiltradas = sesiones.filter((s) =>
    `${s.nombre_cliente} ${s.nombre_clase} ${s.dia} ${s.numero_grupo} ${s.fecha_sesion}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sesiones Programadas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Listado de sesiones</CardTitle>
          <CardDescription>Visualiza cuándo y en qué grupo están programadas las clases por cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, clase, grupo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
              <Link href="/sesiones/nuevo">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva sesion
                  </Button>
              </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Clase</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Día</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora Inicio</TableHead>
                <TableHead>Hora Fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sesionesFiltradas.map((s, i) => (
                <TableRow key={`${s.cedula}-${s.nombre_clase}-${i}`}>
                  <TableCell>{s.nombre_cliente}</TableCell>
                  <TableCell>{s.cedula}</TableCell>
                  <TableCell>{s.nombre_clase}</TableCell>
                  <TableCell>{s.numero_grupo}</TableCell>
                  <TableCell>{s.dia}</TableCell>
                  <TableCell>{new Date(s.fecha_sesion).toLocaleDateString("es-CR")}</TableCell>
                  <TableCell>{new Date(s.hora_inicio).toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" })}</TableCell>
                  <TableCell>{new Date(s.hora_fin).toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
