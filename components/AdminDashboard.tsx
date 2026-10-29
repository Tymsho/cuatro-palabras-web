'use client'

import React, { useState, useTransition, useActionState, useMemo } from 'react'
import Link from 'next/link'
import {
  Shield,
  UserPlus,
  Users,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Trash2,
  Search,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Mail,
  FileText,
  Calendar,
  X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  addOrEnableReaderAction,
  toggleReaderAccessAction,
  deleteReaderAction,
  type ActionResponse,
} from '@/app/admin/actions'

export interface AllowedReader {
  email: string
  has_full_access: boolean
  granted_at: string
  notes: string | null
}

interface AdminDashboardProps {
  initialReaders: AllowedReader[]
  adminEmail: string
  isServiceRoleConfigured?: boolean
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return isoString
  }
}

export function AdminDashboard({
  initialReaders,
  adminEmail,
  isServiceRoleConfigured = true,
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingActionEmail, setPendingActionEmail] = useState<string | null>(null)
  const [rowError, setRowError] = useState<string | null>(null)
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState<string | null>(null)

  const [formState, formAction, isFormPending] = useActionState<ActionResponse | null, FormData>(
    addOrEnableReaderAction,
    null
  )

  const [, startTransition] = useTransition()

  // Filtrado reactivo en cliente
  const filteredReaders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return initialReaders
    return initialReaders.filter(
      (r) =>
        r.email.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
    )
  }, [initialReaders, searchQuery])

  // Estadísticas rápidas
  const totalCount = initialReaders.length
  const activeCount = initialReaders.filter((r) => r.has_full_access).length
  const pausedCount = totalCount - activeCount

  // Manejo de cambio de estado (Pausar / Reactivar)
  const handleToggleStatus = (email: string, currentStatus: boolean) => {
    setRowError(null)
    setPendingActionEmail(email)
    startTransition(async () => {
      try {
        const res = await toggleReaderAccessAction(email, currentStatus)
        if (res.error) {
          setRowError(res.error)
        }
      } catch (err: unknown) {
        setRowError(err instanceof Error ? err.message : 'Error al modificar estado.')
      } finally {
        setPendingActionEmail(null)
      }
    })
  }

  // Manejo de eliminación
  const handleDelete = (email: string) => {
    setRowError(null)
    setPendingActionEmail(email)
    startTransition(async () => {
      try {
        const res = await deleteReaderAction(email)
        if (res.error) {
          setRowError(res.error)
        } else {
          setDeleteConfirmEmail(null)
        }
      } catch (err: unknown) {
        setRowError(err instanceof Error ? err.message : 'Error al eliminar lector.')
      } finally {
        setPendingActionEmail(null)
      }
    })
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Barra de cabecera */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/leer/tomo-1"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition py-1.5 px-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al libro</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <Shield className="w-3 h-3" />
                <span>Panel Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="text-xs text-[var(--text-muted)] hidden md:inline truncate max-w-[200px]"
              title={adminEmail}
            >
              {adminEmail}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenedor principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Título de sección */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-normal tracking-tight">
            Gestión de Lectores Autorizados
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
            Habilita, pausa o elimina el acceso completo al Tomo I para compradores de{' '}
            <strong className="text-[var(--text-primary)] font-medium">Cuatro Palabras</strong>.
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold font-sans">
                Total Registrados
              </p>
              <p className="text-2xl font-serif font-medium text-[var(--text-primary)] mt-1">
                {totalCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-secondary)]">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold font-sans">
                Lectores Habilitados
              </p>
              <p className="text-2xl font-serif font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                {activeCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold font-sans">
                Lectores Pausados
              </p>
              <p className="text-2xl font-serif font-medium text-amber-600 dark:text-amber-400 mt-1">
                {pausedCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <PauseCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Aviso si falta la clave de servicio en .env.local */}
        {!isServiceRoleConfigured && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs sm:text-sm space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              Configuración de Supabase Service Role pendiente
            </p>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Para dar de alta, pausar o eliminar lectores en la base de datos desde este panel, añade tu{' '}
              <code className="px-1.5 py-0.5 rounded bg-[var(--bg-muted)] text-[var(--text-primary)] font-mono text-[11px]">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{' '}
              en el archivo <code className="font-mono text-[11px]">.env.local</code> (la encuentras en tu proyecto de Supabase en <strong>Project Settings ➔ API ➔ service_role secret</strong>).
            </p>
          </div>
        )}

        {/* Formulario de alta rápida */}
        <section className="p-5 sm:p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[var(--text-secondary)]" />
            <h2 className="text-base sm:text-lg font-serif font-medium text-[var(--text-primary)]">
              Habilitar Nuevo Lector
            </h2>
          </div>

          {/* Mensajes de feedback del formulario */}
          {formState?.error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formState.error}</span>
            </div>
          )}

          {formState?.success && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{formState.message}</span>
            </div>
          )}

          {rowError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{rowError}</span>
            </div>
          )}

          <form action={formAction} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-6 space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-sans font-medium text-[var(--text-secondary)]"
              >
                Correo Electrónico del Comprador <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="lector@ejemplo.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label
                htmlFor="notes"
                className="block text-xs font-sans font-medium text-[var(--text-secondary)]"
              >
                Nota / Referencia de Pago (Opcional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  placeholder="Ej: Mercado Pago #1234, Juan Pérez"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isFormPending}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 text-xs sm:text-sm font-medium transition cursor-pointer h-[38px] shadow-xs"
              >
                {isFormPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Habilitando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Habilitar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Lista y buscador de lectores */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-medium text-[var(--text-primary)]">
                Lectores Registrados ({filteredReaders.length})
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Lista ordenada por fecha de concesión de acceso más reciente.
              </p>
            </div>

            {/* Buscador en vivo */}
            <div className="w-full sm:w-72 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por correo o nota..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition"
              />
            </div>
          </div>

          {filteredReaders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-2">
              <Users className="w-8 h-8 mx-auto text-[var(--text-muted)] opacity-60" />
              <p className="text-sm font-serif text-[var(--text-secondary)]">
                {searchQuery
                  ? 'No se encontraron lectores que coincidan con la búsqueda.'
                  : 'Aún no hay lectores registrados en la tabla allowed_readers.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[var(--text-primary)] underline hover:opacity-80 transition cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
              {/* Vista en Tabla para pantallas medianas y grandes */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="border-b border-[var(--border-color)] bg-[var(--bg-muted)]/50 text-[var(--text-muted)] uppercase tracking-wider text-[10px] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Lector (Email)</th>
                      <th className="py-3 px-4">Referencia / Nota</th>
                      <th className="py-3 px-4">Fecha de Alta</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                    {filteredReaders.map((reader) => {
                      const isPending = pendingActionEmail === reader.email
                      const isConfirmingDelete = deleteConfirmEmail === reader.email

                      return (
                        <tr
                          key={reader.email}
                          className="hover:bg-[var(--bg-muted)]/40 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-medium text-[var(--text-primary)]">
                            {reader.email}
                          </td>
                          <td className="py-3.5 px-4 text-[var(--text-muted)]">
                            {reader.notes ? (
                              <span className="italic">{reader.notes}</span>
                            ) : (
                              <span className="opacity-40">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-[var(--text-muted)]">
                            {formatDate(reader.granted_at)}
                          </td>
                          <td className="py-3.5 px-4">
                            {reader.has_full_access ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                                Habilitado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Pausado
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Botón Pausar / Reactivar */}
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() =>
                                  handleToggleStatus(reader.email, reader.has_full_access)
                                }
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer border ${
                                  reader.has_full_access
                                    ? 'border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10'
                                    : 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                                title={
                                  reader.has_full_access ? 'Pausar acceso' : 'Reactivar acceso'
                                }
                              >
                                {isPending ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : reader.has_full_access ? (
                                  <>
                                    <PauseCircle className="w-3 h-3" />
                                    <span>Pausar</span>
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="w-3 h-3" />
                                    <span>Activar</span>
                                  </>
                                )}
                              </button>

                              {/* Botón Eliminar con confirmación */}
                              {isConfirmingDelete ? (
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleDelete(reader.email)}
                                    className="px-2 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-[10px] font-semibold transition cursor-pointer shadow-xs"
                                  >
                                    Confirmar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmEmail(null)}
                                    className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition cursor-pointer"
                                    title="Cancelar"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => setDeleteConfirmEmail(reader.email)}
                                  className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-600 hover:bg-red-500/10 transition cursor-pointer"
                                  title="Eliminar de la lista"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista en Tarjetas para móviles */}
              <div className="block md:hidden divide-y divide-[var(--border-color)]">
                {filteredReaders.map((reader) => {
                  const isPending = pendingActionEmail === reader.email
                  const isConfirmingDelete = deleteConfirmEmail === reader.email

                  return (
                    <div key={reader.email} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                            {reader.email}
                          </p>
                          {reader.notes && (
                            <p className="text-[11px] text-[var(--text-muted)] italic mt-0.5">
                              {reader.notes}
                            </p>
                          )}
                        </div>
                        {reader.has_full_access ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 shrink-0">
                            Habilitado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 shrink-0">
                            Pausado
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-color)]/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(reader.granted_at)}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() =>
                              handleToggleStatus(reader.email, reader.has_full_access)
                            }
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border ${
                              reader.has_full_access
                                ? 'border-amber-500/30 text-amber-700 dark:text-amber-400'
                                : 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : reader.has_full_access ? (
                              'Pausar'
                            ) : (
                              'Activar'
                            )}
                          </button>

                          {isConfirmingDelete ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleDelete(reader.email)}
                                className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-semibold"
                              >
                                Sí
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmEmail(null)}
                                className="p-0.5 text-[var(--text-muted)]"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() => setDeleteConfirmEmail(reader.email)}
                              className="p-1 rounded text-[var(--text-muted)] hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
