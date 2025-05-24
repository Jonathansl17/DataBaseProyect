"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Search, Users } from "lucide-react"

interface ClienteClase {
  nombre_cliente: string
  apellido1: string
  apellido2: string
  cedula: string
  nombre_clase: string
  descripcion_clase: string
}

export default function ClientesPorClasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientes, setClientes] = useState<ClienteClase[]>([])

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:3100/clientes/vistaClientesClase")
        const json = await response.json()

        if (json.success && Array.isArray(json.tables) && Array.isArray(json.tables[0])) {
          setClientes(json.tables[0])
        } else {
          throw new Error("Formato de respuesta inesperado")
        }
      } catch (error) {
        console.error("Error al cargar clientes por clase:", error)
      }
    }

    fetchClientes()
  }, [])

  const clientesFiltrados = clientes.filter((c) =>
    `${c.nombre_cliente} ${c.apellido1} ${c.apellido2} ${c.cedula} ${c.nombre_clase} ${c.descripcion_clase}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes por Clase</h1>
          <p className="text-muted-foreground">
            Consulta de todas las inscripciones de clientes a clases
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Inscripciones</CardTitle>
          <CardDescription>
            Información detallada de cada cliente y la clase a la que está inscrito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, clase o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Clase</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente, index) => (
                <TableRow key={`${cliente.cedula}-${index}`}>
                  <TableCell>
                    {cliente.nombre_cliente} {cliente.apellido1} {cliente.apellido2}
                  </TableCell>
                  <TableCell>{cliente.cedula}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cliente.nombre_clase}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{cliente.descripcion_clase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
