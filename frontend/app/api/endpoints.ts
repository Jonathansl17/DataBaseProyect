const API_BASE_URL = "YOUR_API_BASE_URL" // Ejemplo: 'http://localhost:3001/api'

export const endpoints = {
  // CLIENTES
  clientes: {
    getAll: `${API_BASE_URL}/clientes`, // GET - Obtener todos los clientes
    getById: (id: string) => `${API_BASE_URL}/clientes/${id}`, // GET - Obtener cliente por cédula
    create: `${API_BASE_URL}/clientes`, // POST - Crear cliente (proc: insertar_cliente)
    update: (id: string) => `${API_BASE_URL}/clientes/${id}`, // PUT - Actualizar cliente (proc: actualizar_persona)
    delete: (id: string) => `${API_BASE_URL}/clientes/${id}`, // DELETE - Eliminar cliente (proc: eliminar_persona)
    asignarClase: `${API_BASE_URL}/clientes/asignar-clase`, // POST - Asignar clase (proc: asignar_clase_a_cliente)
  },

  // ENTRENADORES
  entrenadores: {
    getAll: `${API_BASE_URL}/entrenadores`, // GET - Obtener todos los entrenadores
    getById: (id: string) => `${API_BASE_URL}/entrenadores/${id}`, // GET - Obtener entrenador por cédula
    create: `${API_BASE_URL}/entrenadores`, // POST - Crear entrenador
    update: (id: string) => `${API_BASE_URL}/entrenadores/${id}`, // PUT - Actualizar entrenador
    delete: (id: string) => `${API_BASE_URL}/entrenadores/${id}`, // DELETE - Eliminar entrenador
  },

  // ADMINISTRADORES
  administradores: {
    getAll: `${API_BASE_URL}/administradores`, // GET - Obtener todos los administradores
    getById: (id: string) => `${API_BASE_URL}/administradores/${id}`, // GET - Obtener administrador por cédula
    create: `${API_BASE_URL}/administradores`, // POST - Crear administrador
    update: (id: string) => `${API_BASE_URL}/administradores/${id}`, // PUT - Actualizar administrador
    delete: (id: string) => `${API_BASE_URL}/administradores/${id}`, // DELETE - Eliminar administrador
  },

  // CLASES
  clases: {
    getAll: `${API_BASE_URL}/clases`, // GET - Obtener todas las clases
    getById: (id: string) => `${API_BASE_URL}/clases/${id}`, // GET - Obtener clase por ID
    create: `${API_BASE_URL}/clases`, // POST - Crear clase
    update: (id: string) => `${API_BASE_URL}/clases/${id}`, // PUT - Actualizar clase
    delete: (id: string) => `${API_BASE_URL}/clases/${id}`, // DELETE - Eliminar clase
  },

  // SESIONES
  sesiones: {
    getAll: `${API_BASE_URL}/sesiones`, // GET - Obtener todas las sesiones
    getProgramadas: `${API_BASE_URL}/sesiones/programadas`, // GET - Obtener sesiones programadas
    getById: (id: string) => `${API_BASE_URL}/sesiones/${id}`, // GET - Obtener sesión por ID
    create: `${API_BASE_URL}/sesiones`, // POST - Crear sesión
    update: (id: string) => `${API_BASE_URL}/sesiones/${id}`, // PUT - Actualizar sesión
    delete: (id: string) => `${API_BASE_URL}/sesiones/${id}`, // DELETE - Eliminar sesión
  },

  // ASISTENCIA
  asistencia: {
    registrar: `${API_BASE_URL}/asistencia`, // POST - Registrar asistencia (proc: registrar_asistencia_cliente)
    getBySesion: (idSesion: string) => `${API_BASE_URL}/asistencia/sesion/${idSesion}`, // GET - Obtener asistencia por sesión
    getByCliente: (cedula: string) => `${API_BASE_URL}/asistencia/cliente/${cedula}`, // GET - Obtener asistencia por cliente
  },

  // MEMBRESÍAS
  membresias: {
    getAll: `${API_BASE_URL}/membresias`, // GET - Obtener todas las membresías
    getTipos: `${API_BASE_URL}/membresias/tipos`, // GET - Obtener tipos de membresía
    getById: (id: string) => `${API_BASE_URL}/membresias/${id}`, // GET - Obtener membresía por ID
    create: `${API_BASE_URL}/membresias`, // POST - Crear membresía
    renovar: `${API_BASE_URL}/membresias/renovar`, // POST - Renovar membresía (proc: renovar_membresia)
    update: (id: string) => `${API_BASE_URL}/membresias/${id}`, // PUT - Actualizar membresía
    delete: (id: string) => `${API_BASE_URL}/membresias/${id}`, // DELETE - Eliminar membresía
  },

  // PAGOS
  pagos: {
    getAll: `${API_BASE_URL}/pagos`, // GET - Obtener todos los pagos
    getById: (id: string) => `${API_BASE_URL}/pagos/${id}`, // GET - Obtener pago por ID
    create: `${API_BASE_URL}/pagos`, // POST - Crear pago (proc: registrar_pago_membresia)
    getFormasPago: `${API_BASE_URL}/pagos/formas  // POST - Crear pago (proc: registrar_pago_membresia)
    getFormasPago: \`${API_BASE_URL}/pagos/formas-pago`, // GET - Obtener formas de pago
    getByCliente: (cedula: string) => `${API_BASE_URL}/pagos/cliente/${cedula}`, // GET - Obtener pagos por cliente
    getByFecha: (fecha: string) => `${API_BASE_URL}/pagos/fecha/${fecha}`, // GET - Obtener pagos por fecha
  },

  // MÁQUINAS
  maquinas: {
    getAll: `${API_BASE_URL}/maquinas`, // GET - Obtener todas las máquinas
    getById: (id: string) => `${API_BASE_URL}/maquinas/${id}`, // GET - Obtener máquina por ID
    getEstados: `${API_BASE_URL}/maquinas/estados`, // GET - Obtener estados de máquinas
    create: `${API_BASE_URL}/maquinas`, // POST - Crear máquina
    update: (id: string) => `${API_BASE_URL}/maquinas/${id}`, // PUT - Actualizar máquina
    delete: (id: string) => `${API_BASE_URL}/maquinas/${id}`, // DELETE - Eliminar máquina
  },

  // UBICACIONES (Provincias, Cantones, Distritos)
  ubicaciones: {
    provincias: `${API_BASE_URL}/ubicaciones/provincias`, // GET - Obtener provincias
    cantones: (provincia: string) => `${API_BASE_URL}/ubicaciones/cantones/${provincia}`, // GET - Obtener cantones por provincia
    distritos: (canton: string) => `${API_BASE_URL}/ubicaciones/distritos/${canton}`, // GET - Obtener distritos por cantón
    generos: `${API_BASE_URL}/ubicaciones/generos`, // GET - Obtener géneros
  },

  // GRUPOS
  grupos: {
    getAll: `${API_BASE_URL}/grupos`, // GET - Obtener todos los grupos
    getById: (id: string) => `${API_BASE_URL}/grupos/${id}`, // GET - Obtener grupo por número
    create: `${API_BASE_URL}/grupos`, // POST - Crear grupo
    update: (id: string) => `${API_BASE_URL}/grupos/${id}`, // PUT - Actualizar grupo
    delete: (id: string) => `${API_BASE_URL}/grupos/${id}`, // DELETE - Eliminar grupo
  },

  // HORARIOS
  horarios: {
    getAll: `${API_BASE_URL}/horarios`, // GET - Obtener todos los horarios
    getById: (id: string) => `${API_BASE_URL}/horarios/${id}`, // GET - Obtener horario por ID
    create: `${API_BASE_URL}/horarios`, // POST - Crear horario
    update: (id: string) => `${API_BASE_URL}/horarios/${id}`, // PUT - Actualizar horario
    delete: (id: string) => `${API_BASE_URL}/horarios/${id}`, // DELETE - Eliminar horario
  },

  // VISTAS (Consultas predefinidas)
  vistas: {
    clientes: `${API_BASE_URL}/vistas/clientes`, // GET - Vista general de clientes
    clientesClase: `${API_BASE_URL}/vistas/clientes-clase`, // GET - Clientes con clase asignada
    clientesSesion: `${API_BASE_URL}/vistas/clientes-sesion`, // GET - Clientes con información de sesión
  },

  // REPORTES (Consultas avanzadas)
  reportes: {
    rankingClientes: `${API_BASE_URL}/reportes/ranking-clientes`, // GET - Ranking de clientes por clases
    membresiasVencidas: `${API_BASE_URL}/reportes/membresias-vencidas`, // GET - Membresías vencidas
    estadoGrupos: `${API_BASE_URL}/reportes/estado-grupos`, // GET - Estado de grupos
    distribucionGenero: `${API_BASE_URL}/reportes/distribucion-genero`, // GET - Distribución por género
    sesionesFecha: `${API_BASE_URL}/reportes/sesiones-fecha`, // GET - Sesiones por fecha
  },

  // ESTADÍSTICAS (Para el dashboard)
  estadisticas: {
    dashboard: `${API_BASE_URL}/estadisticas/dashboard`, // GET - Estadísticas generales
    clientesActivos: `${API_BASE_URL}/estadisticas/clientes-activos`, // GET - Clientes activos
    ingresosMensuales: `${API_BASE_URL}/estadisticas/ingresos-mensuales`, // GET - Ingresos del mes
    sesionesHoy: `${API_BASE_URL}/estadisticas/sesiones-hoy`, // GET - Sesiones de hoy
  },
}

// Funciones helper para hacer las peticiones HTTP
export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },

  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },

  put: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },

  delete: async (url: string) => {
    const response = await fetch(url, { method: "DELETE" })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return response.json()
  },
}
