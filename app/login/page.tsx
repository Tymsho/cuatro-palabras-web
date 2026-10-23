'use client'

import React, { useState, useTransition, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

type AuthMode = 'login' | 'register' | 'magic-link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo') || '/leer/tomo-1'

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === 'auth_callback_error'
      ? 'El enlace de acceso ha expirado o no es válido. Por favor, solicita uno nuevo.'
      : null
  )
  const [isPending, startTransition] = useTransition()

  // Limpiar errores al cambiar de pestaña
  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setErrorMessage(null)
    setIsSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanEmail = email.trim()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.')
      return
    }

    // 1. Modo Magic Link (Enlace al correo)
    if (mode === 'magic-link') {
      startTransition(async () => {
        try {
          const supabase = createClient()
          const origin = window.location.origin
          const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`

          const { error } = await supabase.auth.signInWithOtp({
            email: cleanEmail,
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
            setSuccessMessage(
              `Hemos enviado un enlace mágico a ${cleanEmail}. Haz clic en el enlace para entrar de forma inmediata a la lectura.`
            )
          }
        } catch (err: unknown) {
          setErrorMessage(err instanceof Error ? err.message : 'Error de conexión inesperado.')
        }
      })
      return
    }

    // 2. Modo Registro (Crear Cuenta)
    if (mode === 'register') {
      if (password.length < 6) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
        return
      }

      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.')
        return
      }

      startTransition(async () => {
        try {
          const supabase = createClient()
          const origin = window.location.origin
          const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`

          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              emailRedirectTo,
            },
          })

          if (error) {
            if (error.message.includes('already registered')) {
              setErrorMessage('Este correo ya tiene una cuenta registrada. Intenta iniciar sesión.')
            } else {
              setErrorMessage(error.message || 'Error al crear la cuenta.')
            }
            return
          }

          // Si Supabase no requiere confirmación por email y devolvió sesión directa
          if (data?.session) {
            router.push(redirectTo)
            router.refresh()
            return
          }

          // Si requiere confirmación por correo
          setIsSuccess(true)
          setSuccessMessage(
            `Cuenta creada. Te enviamos un correo de confirmación a ${cleanEmail}. Por favor, revisa tu bandeja para activar tu cuenta.`
          )
        } catch (err: unknown) {
          setErrorMessage(err instanceof Error ? err.message : 'Error inesperado al registrarse.')
        }
      })
      return
    }

    // 3. Modo Inicio de Sesión con Contraseña
    if (mode === 'login') {
      if (!password) {
        setErrorMessage('Por favor, ingresa tu contraseña.')
        return
      }

      startTransition(async () => {
        try {
          const supabase = createClient()
          const { error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          })

          if (error) {
            if (
              error.message.includes('Invalid login credentials') ||
              error.message.includes('invalid_grant')
            ) {
              setErrorMessage('Correo o contraseña incorrectos. Verifica tus datos o usa el enlace al correo.')
            } else {
              setErrorMessage(error.message || 'Error al iniciar sesión.')
            }
            return
          }

          // Redirección exitosa
          router.push(redirectTo)
          router.refresh()
        } catch (err: unknown) {
          setErrorMessage(err instanceof Error ? err.message : 'Error inesperado de autenticación.')
        }
      })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Barra superior de navegación y selector de tema */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={redirectTo}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition py-1.5 px-2.5 rounded-lg hover:bg-[var(--bg-muted)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al libro</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Tarjeta editorial con variables semánticas */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-9 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] relative overflow-hidden transition-colors duration-200">
        {/* Cabecera de la tarjeta */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] mb-3 shadow-xs">
            <BookOpen className="w-5 h-5 stroke-[1.75]" />
          </div>
          <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] sm:tracking-[0.28em] text-[var(--text-muted)] font-medium">
            Cuatro Palabras
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mt-1.5 font-normal tracking-tight">
            Acceso a la Lectura
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[var(--text-secondary)] mt-2 leading-relaxed">
            {mode === 'login' && 'Ingresa a tu cuenta para continuar con tu lectura.'}
            {mode === 'register' && 'Crea tu cuenta para acceder a la plataforma.'}
            {mode === 'magic-link' && 'Ingresa tu correo para recibir un enlace directo de acceso.'}
          </p>
        </div>

        {/* Selector de pestañas: Iniciar Sesión / Crear Cuenta */}
        {mode !== 'magic-link' && (
          <div className="flex border-b border-[var(--border-color)] mb-6">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-medium font-sans text-center transition-colors relative cursor-pointer ${
                mode === 'login'
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Iniciar Sesión
              {mode === 'login' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-primary)] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('register')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-medium font-sans text-center transition-colors relative cursor-pointer ${
                mode === 'register'
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              Crear Cuenta
              {mode === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--text-primary)] rounded-full" />
              )}
            </button>
          </div>
        )}

        {/* Mensaje de error si existe */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Estado de éxito (Magic Link enviado o confirmación de registro) */}
        {isSuccess ? (
          <div className="text-center py-2 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] mb-3.5 border border-[var(--border-color)]">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-serif text-[var(--text-primary)] mb-2">
              Revisá tu correo
            </h2>

            <p className="text-xs sm:text-sm font-sans text-[var(--text-secondary)] leading-relaxed mb-5">
              {successMessage}
            </p>

            <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 sm:p-3.5 mb-5 text-[11px] sm:text-xs text-[var(--text-muted)] text-left leading-relaxed">
              <span className="font-semibold text-[var(--text-primary)] block mb-0.5">
                ¿No encuentras el mensaje?
              </span>
              Revisa tu carpeta de correo no deseado (spam) o promociones. Puede demorar un minuto en llegar.
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false)
                setPassword('')
                setConfirmPassword('')
                setErrorMessage(null)
              }}
              className="text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4 transition-colors cursor-pointer py-1"
            >
              Volver al formulario
            </button>
          </div>
        ) : (
          /* Formulario */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de Correo Electrónico */}
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-wider font-semibold text-[var(--text-secondary)] mb-1.5"
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
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] disabled:opacity-60 transition"
                />
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Campos de Contraseña (Solo en login y registro) */}
            {mode !== 'magic-link' && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-wider font-semibold text-[var(--text-secondary)] mb-1.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      required
                      disabled={isPending}
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] disabled:opacity-60 transition"
                    />
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer p-0.5"
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña (Solo en registro) */}
                {mode === 'register' && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-[10px] sm:text-[11px] font-sans uppercase tracking-wider font-semibold text-[var(--text-secondary)] mb-1.5"
                    >
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        required
                        disabled={isPending}
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm font-sans placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] focus:ring-1 focus:ring-[var(--text-primary)] disabled:opacity-60 transition"
                      />
                      <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer p-0.5"
                        title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 sm:py-3.5 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-sans font-medium text-xs sm:text-sm rounded-lg hover:opacity-90 active:opacity-100 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs group cursor-pointer min-h-[46px] mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--bg-primary)]" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Iniciar Sesión'}
                    {mode === 'register' && 'Crear mi Cuenta'}
                    {mode === 'magic-link' && 'Enviar enlace mágico'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--bg-primary)] group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {/* Opciones Secundarias Discretas */}
            <div className="pt-3 text-center space-y-2 border-t border-[var(--border-color)]">
              {mode !== 'magic-link' ? (
                <button
                  type="button"
                  onClick={() => handleModeChange('magic-link')}
                  className="text-[11px] sm:text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-4 cursor-pointer block w-full"
                >
                  ¿Olvidaste tu contraseña o prefieres entrar sin ella? Entrar con enlace al correo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleModeChange('login')}
                  className="text-[11px] sm:text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-4 cursor-pointer block w-full"
                >
                  ← Volver a iniciar sesión con contraseña
                </button>
              )}
            </div>
          </form>
        )}

        {/* Separador con cita literaria */}
        <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center">
          <p className="text-[11px] sm:text-xs font-serif italic text-[var(--text-muted)]">
            «Cuatro palabras bastan para comenzar a habitar una historia.»
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--bg-primary)] flex items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-200">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 sm:p-10 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
            <p className="text-xs text-[var(--text-muted)] font-sans">Cargando acceso a la lectura...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
