"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Search } from "lucide-react"

export default function AsistenciaPage() {
  const [selectedSesion, setSelectedSesion] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Aquí conectarías con tu API: GET /api/sesiones-programadas
  const sesionesProgramadas = [
    {
      id_sesion_programada: 1,
      clase: "Zumba",
      fecha: "2025-06-01",
      hora: "08:00-09:00",
      grupo: 1,
    },
    // Más datos...
  ]

  // Aquí conectarías con tu API: GET /api/clientes-sesion/{id}
  const clientesSesion = [
    {
      cedula: "414086906",
      nombre: "Mónica Soto Campos",
      asistio: null, // null = no registrado, true = asistió, false = no asistió
    },
    // Más datos...
  ]

  const registrarAsistencia = async (cedula: string, asistio: boolean) => {
    // Aquí conectarías con tu API: POST /api/asistencia
    // Usando el procedimiento: registrar_asistencia_cliente
    try {
      const response = await fetch("/api/asistencia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula,
          id_sesion_programada: selectedSesion,
          asistio,
        }),
      })

      if (response.ok) {
        console.log("Asistencia registrada")
        // Actualizar la lista
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Control de Asistencia</h1>
        <p className="text-muted-foreground">Registra la asistencia de los clientes a las clases</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seleccionar Sesión</CardTitle>
            <CardDescription>Elige la sesión para registrar asistencia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sesion">Sesión Programada</Label>
              <Select value={selectedSesion} onValueChange={setSelectedSesion}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sesión" />
                </SelectTrigger>
                <SelectContent>
                  {sesionesProgramadas.map((sesion) => (
                    <SelectItem key={sesion.id_sesion_programada} value={sesion.id_sesion_programada.toString()}>
                      {sesion.clase} - {sesion.fecha} ({sesion.hora}) - Grupo {sesion.grupo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSesion ? (
              <div className="space-y-2">
                <div>
                  <strong>Clase:</strong> Zumba
                </div>
                <div>
                  <strong>Fecha:</strong> 2025-06-01
                </div>
                <div>
                  <strong>Horario:</strong> 08:00 - 09:00
                </div>
                <div>
                  <strong>Grupo:</strong> 1
                </div>
                <div>
                  <strong>Inscritos:</strong> 5 clientes
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Selecciona una sesión para ver los detalles</p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSesion && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Marca la asistencia de cada cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesSesion.map((cliente) => (
                  <TableRow key={cliente.cedula}>
                    <TableCell className="font-medium">{cliente.cedula}</TableCell>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>
                      {cliente.asistio === null && <Badge variant="outline">Pendiente</Badge>}
                      {cliente.asistio === true && <Badge variant="default">Asistió</Badge>}
                      {cliente.asistio === false && <Badge variant="destructive">No Asistió</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => registrarAsistencia(cliente.cedula, true)}
                          disabled={cliente.asistio !== null}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Asistió
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => registrarAsistencia(cliente.cedula, false)}
                          disabled={cliente.asistio !== null}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          No Asistió
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
