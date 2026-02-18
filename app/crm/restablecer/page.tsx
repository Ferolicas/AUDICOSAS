"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, KeyRound, Check } from "lucide-react"
import { Suspense } from "react"

function ResetForm() {
  const searchParams = useSearchParams()
  const tokenParam = searchParams.get("token")

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/crm/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      setSuccess(data.message)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/crm/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenParam, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error)
        return
      }

      setSuccess(data.message)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-60 h-60 mb-4">
              <Image
                src="/logoaudico.png"
                alt="AUDICO ISO"
                width={240}
                height={240}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {tokenParam ? "Nueva contraseña" : "Restablecer contraseña"}
            </h1>
            <p className="text-slate-400 text-sm mt-1 text-center">
              {tokenParam
                ? "Ingresa tu nueva contraseña"
                : "Te enviaremos instrucciones a tu correo"
              }
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Forms */}
          {tokenParam ? (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-1">
                  Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Cambiar contraseña
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Enviar instrucciones
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/crm/login"
              className="text-sm text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RestablecerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetForm />
    </Suspense>
  )
}
