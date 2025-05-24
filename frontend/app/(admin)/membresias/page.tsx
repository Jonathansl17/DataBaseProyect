"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"
import { TipoMembresia } from "@/types/tipoMembresia"
import { Persona } from "@/types/persona"
import ClientCard from "../inscripciones/clientCard"

export default function RenovarMembresia() {
  const [cedula, setCedula] = useState("414086906")
  const [monto, setMonto] = useState(15000)
  const [idFormaPago, setIdFormaPago] = useState(1)
  const [estado, setEstado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState<Persona | null>(null)
  const [tiposMembresia, setTiposMembresia] = useState<TipoMembresia[]>([])

  const formasDePago = [
    { id: 1, nombre: "Tarjeta" },
    { id: 2, nombre: "Simpe" },
    { id: 3, nombre: "Efectivo" },
  ]

  useEffect(() => {
    const fetchTiposMembresia = async () => {
      try {
        const response = await fetch("http://localhost:3100/consultas/tipoMembresia")
        if (!response.ok) {
          throw new Error("Error al obtener los tipos de membresía.")
        }
        const data = await response.json()
        setTiposMembresia(data.data)
      } catch (error) {
        console.error("Error fetching tipos de membresia:", error)
      }
    }
    fetchTiposMembresia()
  }, [])

  const buscarPersona = async () => {
    if (cedula.trim().length !== 9) {
      setError("La cédula debe tener exactamente 9 dígitos.")
      setPersona(null)
      return
    }

    try {
      const response = await fetch(`http://localhost:3100/consultas/cliente/${cedula.trim()}`)
      const data = await response.json()
      if (data.success) {
        setPersona(data.data)
        setError(null)
        setEstado(null)
      } else {
        setPersona(null)
        setError(`No se encontró ningún cliente con la cédula ${cedula}`)
      }
    } catch (err) {
      console.error("Error al buscar cliente:", err)
      setPersona(null)
      setError("Ocurrió un error al buscar el cliente.")
    }
  }

  const renovar = async () => {
    setLoading(true)
    setEstado(null)
    setError(null)

    try {
      const response = await fetch("http://localhost:3100/membresias/renovarMembresia", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula,
          monto,
          id_forma_pago: idFormaPago,
        }),
      })

      if (!response.ok) {
        throw new Error("No se pudo renovar la membresía.")
      }

      const data = await response.json()
      setEstado("Membresía renovada con éxito.")
      setPersona(null)
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Columna izquierda */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h1 className="text-2xl font-bold text-left">Renovar Membresía</h1>

          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <div className="flex gap-2">
              <Input
                id="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej: 414086906"
              />
              <Button onClick={buscarPersona}>Buscar</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto (₡)</Label>
            <Input
              id="monto"
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              placeholder="Ej: 15000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formaPago">Forma de Pago</Label>
            <select
              id="formaPago"
              className="w-full border rounded px-3 py-2"
              value={idFormaPago}
              onChange={(e) => setIdFormaPago(Number(e.target.value))}
            >
              {formasDePago.map((forma) => (
                <option key={forma.id} value={forma.id}>
                  {forma.nombre}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={renovar} disabled={!persona || loading} className="w-full">
            {loading ? "Procesando..." : "Renovar"}
          </Button>

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
        </div>

        <div className="space-y-6">
          {persona && (
            <ClientCard persona={persona}
            mt={0}
            />
          )}

        </div>
      </div>
    </div>
  )
}
