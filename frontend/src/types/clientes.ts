export interface Cliente {
  nombre: string
  apellido1: string
  apellido2: string
  cedula: string
  telefono: string
  fecha_registro: string
  fecha_expiracion: string | null
  tipo_membresia: string | null
  estado_cliente: string
}
