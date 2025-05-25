"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"

interface Clase {
  id_clase: number
  nombre: string
  descripcion: string
  total_sesiones: number
}

export default function ClasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [clases, setClases] = useState<Clase[]>([])

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await fetch("http://localhost:3100/clases/vistaTotalClasesPorSesion")
        const json = await response.json()

        if (json.success && Array.isArray(json.data)) {
          setClases(json.data)
        } else {
          throw new Error("Formato de respuesta inesperado")
        }
      } catch (error) {
        console.error("Error al cargar clases:", error)
      }
    }

    fetchClases()
  }, [])

  const clasesFiltradas = clases.filter((clase) =>
    `${clase.nombre} ${clase.descripcion}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clases creadas</h1>
          <p className="text-muted-foreground">
            Consulta y administración de clases creadas en el sistema
          </p>
        </div>
        <Link href="/clases/nuevo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva clase
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Clases</CardTitle>
          <CardDescription>
            Detalles de las clases creadas y cantidad de sesiones asignadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Sesiones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clasesFiltradas.map((clase) => (
                <TableRow key={clase.id_clase}>
                  <TableCell>{clase.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{clase.descripcion}</TableCell>
                  <TableCell>{clase.total_sesiones}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
