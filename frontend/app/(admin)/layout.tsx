import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner" 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FastFitness Admin",
  description: "Sistema de administración para gimnasio FastFitness",
}

export default function adminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400 text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster /> 
    </div>
  )
}
