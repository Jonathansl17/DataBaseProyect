import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default function ReportesPage() {
  const reportes = [
    {
      title: "Ranking de Clientes",
      description: "Clientes ordenados por número de clases inscritas",
      icon: TrendingUp,
      href: "/reportes/clientes-ranking",
      query: "Consulta avanzada 1: Ranking de clientes por numero de clases",
    },
    {
      title: "Membresías Vencidas",
      description: "Clientes con membresías expiradas",
      icon: Users,
      href: "/reportes/membresias-vencidas",
      query: "Consulta avanzada 2: Clientes que tienen membresia vencida",
    },
    {
      title: "Estado de Grupos",
      description: "Capacidad y matriculados por grupo",
      icon: BarChart3,
      href: "/reportes/grupos-estado",
      query: "Consulta avanzada 3: Promedio de matriculados por grupo",
    },
    {
      title: "Distribución por Género",
      description: "Distribución de género por estado de clientes",
      icon: Users,
      href: "/reportes/distribucion-genero",
      query: "Consulta avanzada 4: distribucion de genero por estado",
    },
    {
      title: "Sesiones por Fecha",
      description: "Cantidad de sesiones programadas por fecha",
      icon: Calendar,
      href: "/reportes/sesiones-fecha",
      query: "Consulta avanzada 5: Cuenta las cantidades de sesiones por fecha",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">Consultas avanzadas y análisis del gimnasio</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportes.map((reporte) => {
          const Icon = reporte.icon
          return (
            <Link key={reporte.title} href={reporte.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{reporte.title}</CardTitle>
                  </div>
                  <CardDescription>{reporte.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">{reporte.query}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vistas Disponibles</CardTitle>
          <CardDescription>Vistas creadas en la base de datos para consultas frecuentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">vista_clientes</h4>
              <p className="text-sm text-muted-foreground">
                Vista general de todos los clientes con información completa
              </p>
              <code className="text-xs bg-muted p-1 rounded">GET /api/vistas/clientes</code>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">vista_clientes_clase</h4>
              <p className="text-sm text-muted-foreground">Clientes con su clase actual asignada</p>
              <code className="text-xs bg-muted p-1 rounded">GET /api/vistas/clientes-clase</code>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">vista_clientes_sesion</h4>
              <p className="text-sm text-muted-foreground">Información de sesiones que debe asistir cada cliente</p>
              <code className="text-xs bg-muted p-1 rounded">GET /api/vistas/clientes-sesion</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
