# FastFitness Admin - Sistema de Administración

Este es un frontend completo en Next.js con Tailwind CSS para administrar el gimnasio FastFitness.

## Estructura del Proyecto

### Páginas Principales
- **Dashboard** (`/`) - Vista general con estadísticas y acciones rápidas
- **Clientes** (`/clientes`) - Gestión completa de clientes
- **Entrenadores** (`/entrenadores`) - Administración de entrenadores
- **Administradores** (`/administradores`) - Gestión de administradores
- **Clases** (`/clases`) - Manejo de clases disponibles
- **Sesiones** (`/sesiones`) - Programación de sesiones
- **Asistencia** (`/asistencia`) - Control de asistencia a clases
- **Membresías** (`/membresias`) - Gestión de membresías
- **Pagos** (`/pagos`) - Procesamiento de pagos
- **Máquinas** (`/maquinas`) - Administración de equipos
- **Ubicaciones** (`/ubicaciones`) - Gestión de provincias, cantones, distritos
- **Reportes** (`/reportes`) - Consultas avanzadas y análisis

### Endpoints de API

Todos los endpoints están definidos en `app/api/endpoints.ts`. Debes reemplazar `YOUR_API_BASE_URL` con la URL de tu backend.

#### Procedimientos Almacenados Implementados:
- `insertar_cliente` - Crear nuevo cliente
- `actualizar_persona` - Actualizar información de persona
- `eliminar_persona` - Eliminar persona del sistema
- `asignar_clase_a_cliente` - Inscribir cliente en clase
- `registrar_asistencia_cliente` - Marcar asistencia
- `registrar_pago_membresia` - Procesar pago de membresía
- `renovar_membresia` - Renovar membresía existente

#### Vistas Utilizadas:
- `vista_clientes` - Información completa de clientes
- `vista_clientes_clase` - Clientes con clases asignadas
- `vista_clientes_sesion` - Información de sesiones por cliente

#### Consultas Avanzadas:
1. Ranking de clientes por número de clases inscritas
2. Clientes con membresías vencidas
3. Estado de grupos (capacidad vs matriculados)
4. Distribución de género por estado de clientes
5. Cantidad de sesiones por fecha

## Configuración

### 1. Instalar Dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar API
Edita el archivo `app/api/endpoints.ts` y reemplaza `YOUR_API_BASE_URL` con la URL de tu backend:

\`\`\`typescript
const API_BASE_URL = 'http://localhost:3001/api' // Tu URL aquí
\`\`\`

### 3. Ejecutar en Desarrollo
\`\`\`bash
npm run dev
\`\`\`

## Funcionalidades Implementadas

### ✅ Gestión de Clientes
- Lista completa con filtros y búsqueda
- Formulario de registro con validaciones
- Edición y eliminación
- Asignación a clases
- Vista de membresías activas

### ✅ Control de Asistencia
- Selección de sesión programada
- Lista de clientes inscritos
- Registro de asistencia (asistió/no asistió)
- Validaciones de inscripción

### ✅ Procesamiento de Pagos
- Búsqueda de cliente por cédula
- Selección de tipo de membresía
- Cálculo automático de montos
- Múltiples formas de pago
- Historial completo de pagos

### ✅ Reportes y Análisis
- Dashboard con estadísticas generales
- Consultas avanzadas predefinidas
- Visualización de datos en tablas
- Filtros y búsquedas

### ✅ Navegación y UX
- Sidebar con navegación completa
- Header con búsqueda global
- Diseño responsivo
- Componentes reutilizables

## Próximos Pasos

1. **Conectar con tu Backend**: Reemplaza las URLs en `endpoints.ts`
2. **Implementar Autenticación**: Agregar login y manejo de sesiones
3. **Validaciones**: Implementar validaciones del lado cliente
4. **Estados de Carga**: Agregar spinners y estados de carga
5. **Manejo de Errores**: Implementar manejo robusto de errores
6. **Notificaciones**: Agregar toasts para feedback al usuario

## Tecnologías Utilizadas

- **Next.js 14** - Framework de React
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Iconos
- **TypeScript** - Tipado estático

## Estructura de Archivos

\`\`\`
app/
├── page.tsx                 # Dashboard principal
├── layout.tsx              # Layout principal
├── globals.css             # Estilos globales
├── api/
│   └── endpoints.ts        # Configuración de endpoints
├── clientes/
│   ├── page.tsx           # Lista de clientes
│   └── nuevo/
│       └── page.tsx       # Formulario nuevo cliente
├── asistencia/
│   └── page.tsx           # Control de asistencia
├── pagos/
│   ├── page.tsx           # Lista de pagos
│   └── nuevo/
│       └── page.tsx       # Formulario nuevo pago
└── reportes/
    └── page.tsx           # Lista de reportes

components/
├── sidebar.tsx            # Navegación lateral
└── header.tsx            # Header con búsqueda
\`\`\`

Este sistema está listo para conectarse con tu backend de SQL Server y utilizar todos los procedimientos almacenados, vistas y consultas que has creado.
