"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function PortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/crm/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión")
        return
      }

      if (data.mustChangePassword) {
        router.push("/portal/cambiar-contrasena")
      } else if (data.clienteRef) {
        router.push("/portal")
      } else {
        // Not a client user, redirect to CRM
        router.push("/crm")
      }
      router.refresh()
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0F1B33 0%, #1B2A4A 40%, #2563EB 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-48 mb-4">
              <Image
                src="/logoaudico.png"
                alt="AUDICO ISO"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-[#0F1B33]">Portal de Cliente</h1>
            <p className="text-slate-500 text-sm mt-1">Consulta el estado de tus procesos</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Si no tienes cuenta, contacta a AUDICO para solicitar acceso.
            </p>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Volver al sitio web
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
