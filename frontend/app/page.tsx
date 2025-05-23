import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Dumbbell, Calendar, CreditCard, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Clientes",
      value: "0",
      description: "Clientes registrados",
      icon: Users,
      href: "/clientes",
    },
    {
      title: "Entrenadores",
      value: "0",
      description: "Entrenadores activos",
      icon: UserCheck,
      href: "/entrenadores",
    },
    {
      title: "Clases",
      value: "0",
      description: "Clases disponibles",
      icon: Dumbbell,
      href: "/clases",
    },
    {
      title: "Sesiones Hoy",
      value: "0",
      description: "Sesiones programadas",
      icon: Calendar,
      href: "/sesiones",
    },
    {
      title: "Pagos del Mes",
      value: "$0",
      description: "Ingresos mensuales",
      icon: CreditCard,
      href: "/pagos",
    },
    {
      title: "Máquinas",
      value: "0",
      description: "Equipos disponibles",
      icon: BarChart3,
      href: "/maquinas",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al sistema de administración FastFitness</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Operaciones frecuentes del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/clientes/nuevo" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Registrar Cliente</div>
              <div className="text-sm text-muted-foreground">Agregar nuevo cliente al sistema</div>
            </Link>
            <Link href="/asistencia" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Registrar Asistencia</div>
              <div className="text-sm text-muted-foreground">Marcar asistencia a clases</div>
            </Link>
            <Link href="/pagos/nuevo" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
              <div className="font-medium">Procesar Pago</div>
              <div className="text-sm text-muted-foreground">Registrar pago de membresía</div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes</CardTitle>
            <CardDescription>Consultas y análisis del gimnasio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/reportes/clientes-ranking"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Ranking de Clientes</div>
              <div className="text-sm text-muted-foreground">Por número de clases inscritas</div>
            </Link>
            <Link
              href="/reportes/membresias-vencidas"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Membresías Vencidas</div>
              <div className="text-sm text-muted-foreground">Clientes con membresías expiradas</div>
            </Link>
            <Link
              href="/reportes/grupos-estado"
              className="block p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-medium">Estado de Grupos</div>
              <div className="text-sm text-muted-foreground">Capacidad y matriculados</div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
