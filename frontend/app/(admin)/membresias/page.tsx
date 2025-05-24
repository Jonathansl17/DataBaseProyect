"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

export default function RenovarMembresia() {
  const [cedula, setCedula] = useState("414086906")
  const [monto, setMonto] = useState(15000)
  const [idFormaPago, setIdFormaPago] = useState(1)
  const [estado, setEstado] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
          id_forma_pago: idFormaPago
        }),
      })

      if (!response.ok) {
        throw new Error("El cliente no tiene una membresía activa.")
      }

      const data = await response.json()
      setEstado("Membresía renovada con éxito.")
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Renovar Membresía</h1>

        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula</Label>
          <Input
            id="cedula"
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ej: 414086906"
          />
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
          <Label htmlFor="formaPago">Forma de Pago (ID)</Label>
          <Input
            id="formaPago"
            type="number"
            value={idFormaPago}
            onChange={(e) => setIdFormaPago(Number(e.target.value))}
            placeholder="Ej: 1"
          />
        </div>

        <Button
          onClick={renovar}
          disabled={loading}
          className="w-full"
        >
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
    </div>
  )
}
