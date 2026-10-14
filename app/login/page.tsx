'use client'

import React, { useState, useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { BookOpen, Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo') || '/leer/tomo-1'

  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === 'auth_callback_error'
      ? 'El enlace de acceso ha expirado o no es válido. Por favor, solicita uno nuevo.'
      : null
  )
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.')
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        const origin = window.location.origin
        const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`

        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo,
          },
        })

        if (error) {
          setErrorMessage(
            error.message === 'Rate limit exceeded'
              ? 'Has alcanzado el límite de intentos. Espera unos momentos antes de intentar nuevamente.'
              : error.message || 'Ocurrió un error al enviar el enlace. Intenta nuevamente.'
          )
        } else {
          setIsSuccess(true)
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage('Error de conexión inesperado. Revisa tu red.')
        }
      }
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Botón superior para volver en celulares */}
      <div className="mb-4 text-left">
        <Link
          href={redirectTo}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition py-1 px-2 rounded hover:bg-stone-200/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al libro</span>
        </Link>
      </div>

      {/* Tarjeta con estética de pliego editorial / libro impreso */}
      <div className="bg-[#FFFDF9] border border-stone-200/90 rounded-2xl p-6 sm:p-10 shadow-[0_10px_35px_-5px_rgba(28,25,23,0.06)] relative overflow-hidden">
        {/* Cabecera literaria */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF8F5] border border-stone-200 text-stone-800 mb-3.5 sm:mb-4 shadow-xs">
            <BookOpen className="w-5 h-5 stroke-[1.75]" />
          </div>
          <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] sm:tracking-[0.28em] text-stone-500 font-medium">
            Cuatro Palabras
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1.5 sm:mt-2 font-normal tracking-tight">
            Acceso a la Lectura
          </h1>
          <p className="text-xs sm:text-sm font-sans text-stone-600 mt-2 leading-relaxed px-1 sm:px-0">
            Ingresa tu correo para recibir un enlace de acceso directo. Sin necesidad de contraseñas.
          </p>
        </div>

        {/* Mensaje de error general si existe */}
        {errorMessage && (
          <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          /* Estado de éxito: Magic Link enviado */
          <div className="text-center py-2 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-stone-100 text-stone-800 mb-3.5 sm:mb-4 border border-stone-200">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800 stroke-[1.75]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 mb-2">
              Revisá tu correo
            </h2>

            <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed mb-4">
              Hemos enviado un enlace mágico a{' '}
              <strong className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-2 break-all">
                {email}
              </strong>
              . Haz clic en el enlace para entrar de forma inmediata a la lectura.
            </p>

            <div className="bg-[#FAF8F5] border border-stone-200 rounded-lg p-3 sm:p-3.5 mb-5 sm:mb-6 text-[11px] sm:text-xs text-stone-500 text-left leading-relaxed">
              <span className="font-semibold text-stone-700 block mb-0.5">¿No encuentras el mensaje?</span>
              Revisa tu carpeta de correo no deseado (spam) o promociones. Puede demorar unos instantes en llegar.
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false)
                setEmail('')
                setErrorMessage(null)
              }}
              className="text-xs font-sans text-stone-500 hover:text-stone-900 underline underline-offset-4 transition-colors cursor-pointer py-1"
            >
              Usar otra dirección de correo
            </button>
          </div>
        ) : (
          /* Formulario de ingreso */
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-wider font-semibold text-stone-600 mb-1.5 sm:mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lector@ejemplo.com"
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className="w-full pl-10 sm:pl-11 pr-4 py-3 bg-[#FAF8F5] border border-stone-300 rounded-lg text-stone-900 text-sm font-sans placeholder:text-stone-400 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 disabled:opacity-60 transition"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 active:bg-black text-[#FAF8F5] font-sans font-medium text-xs sm:text-sm rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-xs group cursor-pointer min-h-[48px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
                  <span>Enviando enlace...</span>
                </>
              ) : (
                <>
                  <span>Enviar enlace mágico</span>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Separador sutil con cita literaria */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-200/70 text-center">
          <p className="text-[11px] sm:text-xs font-serif italic text-stone-400">
            «Cuatro palabras bastan para comenzar a habitar una historia.»
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 font-sans">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 sm:p-10 bg-[#FFFDF9] border border-stone-200 rounded-2xl shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-stone-500" />
            <p className="text-xs text-stone-500 font-sans">Cargando acceso a la lectura...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
