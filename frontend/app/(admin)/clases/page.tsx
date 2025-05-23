"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"

export default function ClasesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Aquí conectarías con tu API: GET /api/clases
  const clases = [
    {
      id_clase: 1,
      nombre: "Zumba",
      descripcion: "Ejercicio de baile",
      inscritos: 5,
    },
    {
      id_clase: 2,
      nombre: "Spinning",
      descripcion: "Bicicleta",
      inscritos: 8,
    },
    // Más datos...
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clases</h1>
          <p className="text-muted-foreground">Gestiona las clases disponibles en el gimnasio</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clases</CardTitle>
          <CardDescription>Todas las clases disponibles en el gimnasio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Inscritos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clases.map((clase) => (
                <TableRow key={clase.id_clase}>
                  <TableCell className="font-medium">{clase.id_clase}</TableCell>
                  <TableCell>{clase.nombre}</TableCell>
                  <TableCell>{clase.descripcion}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {clase.inscritos}
                    </div>
                  </TableCell>
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
