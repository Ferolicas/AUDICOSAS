"use client"

import Image from "next/image"

export function CrmLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo con spinner circular */}
        <div className="relative">
          {/* Anillo giratorio exterior */}
          <div className="absolute -inset-4 rounded-full border-4 border-transparent border-t-primary border-r-primary/40 animate-spin" />
          {/* Anillo giratorio interior (dirección opuesta) */}
          <div
            className="absolute -inset-2 rounded-full border-2 border-transparent border-b-primary/60 border-l-primary/20"
            style={{ animation: "spin 1.5s linear infinite reverse" }}
          />
          {/* Logo */}
          <div className="relative w-20 h-20 animate-pulse">
            <Image
              src="/logoaudico.png"
              alt="AUDICO ISO"
              width={80}
              height={80}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>
        {/* Texto */}
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Cargando</p>
          <div className="flex justify-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CrmNotFound({ message = "Recurso no encontrado" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto opacity-30">
          <Image
            src="/logoaudico.png"
            alt="AUDICO ISO"
            width={64}
            height={64}
            className="object-contain grayscale"
          />
        </div>
        <div>
          <p className="text-2xl font-semibold text-muted-foreground">404</p>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}
