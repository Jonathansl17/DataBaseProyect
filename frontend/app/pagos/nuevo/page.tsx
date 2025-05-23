"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function NuevoPagoPage() {
  const [formData, setFormData] = useState({
    cedula_cliente: "",
    tipo_membresia: "",
    monto: "",
    fecha_pago: new Date().toISOString().split("T")[0],
    id_forma_pago: "",
  })

  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)

  const buscarCliente = async () => {
    // Aquí conectarías con tu API: GET /api/clientes/{cedula}
    if (formData.cedula_cliente) {
      // Simular búsqueda
      setClienteSeleccionado({
        cedula: formData.cedula_cliente,
        nombre: "Cliente Ejemplo",
        estado: "Activo",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Aquí conectarías con tu API: POST /api/pagos
    // Usando el procedimiento: registrar_pago_membresia
    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log("Pago registrado exitosamente")
        // Redirigir o mostrar mensaje de éxito
      }
    } catch (error) {
      console.error("Error al registrar pago:", error)
    }
  }

  const tiposMembresia = [
    { id: 1, nombre: "Mensual", precio: 15000 },
    { id: 2, nombre: "Trimestral", precio: 40000 },
    { id: 3, nombre: "Anual", precio: 120000 },
    { id: 4, nombre: "Semestral", precio: 80000 },
    { id: 5, nombre: "Diaria", precio: 5000 },
  ]

  const formasPago = [
    { id: 1, nombre: "Tarjeta" },
    { id: 2, nombre: "Simpe" },
    { id: 3, nombre: "Efectivo" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/pagos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Pago</h1>
          <p className="text-muted-foreground">Registra un pago de membresía</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Buscar Cliente</CardTitle>
            <CardDescription>Ingresa la cédula del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Cédula del cliente"
                value={formData.cedula_cliente}
                onChange={(e) => setFormData({ ...formData, cedula_cliente: e.target.value })}
              />
              <Button onClick={buscarCliente}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {clienteSeleccionado && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium">{clienteSeleccionado.nombre}</h4>
                <p className="text-sm text-muted-foreground">Cédula: {clienteSeleccionado.cedula}</p>
                <p className="text-sm text-muted-foreground">Estado: {clienteSeleccionado.estado}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Pago</CardTitle>
            <CardDescription>Completa los detalles del pago</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_membresia">Tipo de Membresía</Label>
                <Select
                  value={formData.tipo_membresia}
                  onValueChange={(value) => {
                    const tipo = tiposMembresia.find((t) => t.id.toString() === value)
                    setFormData({
                      ...formData,
                      tipo_membresia: value,
                      monto: tipo?.precio.toString() || "",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMembresia.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nombre} - ₡{tipo.precio.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="15000"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_pago">Fecha de Pago</Label>
                <Input
                  id="fecha_pago"
                  type="date"
                  value={formData.fecha_pago}
                  onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forma_pago">Forma de Pago</Label>
                <Select
                  value={formData.id_forma_pago}
                  onValueChange={(value) => setFormData({ ...formData, id_forma_pago: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar forma de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPago.map((forma) => (
                      <SelectItem key={forma.id} value={forma.id.toString()}>
                        {forma.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Link href="/pagos">
                  <Button variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit" disabled={!clienteSeleccionado}>
                  Registrar Pago
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
