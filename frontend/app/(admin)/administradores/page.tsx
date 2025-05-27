"use client"

import Link from "next/link"  
import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import AdminMaquina from "@/types/adminMaquina"


export default function AdminMaquinasPage() {
  const [maquinas, setMaquinas] = useState<AdminMaquina[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const res = await fetch("http://localhost:3100/admin/vistaAdminMaquina")
        const data = await res.json()

        if (data.success && Array.isArray(data.data)) {
          setMaquinas(data.data)
        } else {
          throw new Error("Formato de datos inválido")
        }
      } catch (err) {
        console.error("Error al cargar máquinas:", err)
      }
    }

    fetchMaquinas()
  }, [])

  const maquinasFiltradas = maquinas.filter((m) =>
    m.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.estado.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const badgeColor = (estado: string) => {
    switch (estado) {
      case "Operativa": return "default"
      case "Mantenimiento": return "outline"
      case "Reparación": return "outline"
      case "Nueva": return "default"
      case "Fuera servicio": return "outline"
      case "Revisada": return "default"
      case "Desuso": return "outline"
      case "Reasignada": return "outline"
      case "Donada": return "outline"
      case "Descompuesta": return "outline"
      default: return "outline"
    }
  }

  return (
      <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administración de Máquinas</h1>
        <p className="text-muted-foreground">Control del estado, revisiones y asignaciones</p>
      </div>
      <Link href="/administradores/maquinas/nuevo" className="mt-4 inline-flex items-center">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva maquina
        </Button>
      </Link>
    </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Máquinas</CardTitle>
          <CardDescription>Filtra por tipo, marca, modelo o estado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar por tipo, marca o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Revisión</TableHead>
                <TableHead>Administrador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maquinasFiltradas.map((m) => (
                <TableRow key={m.id_maquina}>
                  <TableCell>{m.id_maquina}</TableCell>
                  <TableCell>{m.tipo}</TableCell>
                  <TableCell>{m.modelo}</TableCell>
                  <TableCell>{m.marca}</TableCell>
                  <TableCell>
                    <Badge variant={badgeColor(m.estado)}>
                      {m.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(m.ultima_revision).toLocaleDateString()}</TableCell>
                  <TableCell>{m.nombre_admin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
