"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  UserCheck,
  Shield,
  Dumbbell,
  Calendar,
  CreditCard,
  Settings,
  BarChart3,
  UserPlus,
  ClipboardList
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Entrenadores", href: "/entrenadores", icon: UserCheck },
  { name: "Administradores", href: "/administradores", icon: Shield },
  { name: "Clases", href: "/clases", icon: Dumbbell },
  { name: "Sesiones", href: "/sesiones", icon: Calendar },
  { name: "Inscripciones", href: "/inscripciones", icon: ClipboardList },
  { name: "Asistencia", href: "/asistencia", icon: UserPlus },
  { name: "Pagos", href: "/pagos", icon: CreditCard },
  { name: "Máquinas", href: "/maquinas", icon: Settings },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white w-64 shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">FastFitness</h1>
        <p className="text-sm text-gray-500">Sistema de Administración</p>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
