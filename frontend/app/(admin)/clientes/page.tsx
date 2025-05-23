"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Cliente } from "@/types/clientes"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:3100/clientes/vistaClientes")
        if (!response.ok) throw new Error("Error en la respuesta de la API")
        const data = await response.json()

        if (data.success && Array.isArray(data.tables) && Array.isArray(data.tables[0])) {
          setClientes(data.tables[0])
        } else {
          console.warn("Formato de respuesta inesperado:", data)
        }
      } catch (error) {
        console.error("Error al cargar los datos de los clientes:", error)
      }
    }

    fetchClientes()
  }, [])

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Activo: "default",
      Inactivo: "secondary",
      Suspendido: "destructive",
      Nuevo: "outline",
      Revisión: "outline",
      Retirado: "secondary",
      Otros: "outline",
      Congelado: "secondary",
    }
    return <Badge variant={variants[estado] || "outline"}>{estado}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gestiona todos los clientes del gimnasio</p>
        </div>
        <Link href="/clientes/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Todos los clientes registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cédula</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead>Membresía</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes
                .filter((cliente) =>
                  `${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2} ${cliente.cedula}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((cliente) => (
                  <TableRow key={cliente.cedula}>
                    <TableCell className="font-medium">{cliente.cedula}</TableCell>
                    <TableCell>{`${cliente.nombre} ${cliente.apellido1} ${cliente.apellido2}`}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>
                      {new Date(cliente.fecha_registro).toLocaleDateString("es-CR")}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{cliente.tipo_membresia ?? "Sin membresía"}</div>
                        {cliente.fecha_expiracion && (
                          <div className="text-muted-foreground">
                            Exp: {new Date(cliente.fecha_expiracion).toLocaleDateString("es-CR")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(cliente.estado_cliente)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
