'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Lock,
  ArrowLeft,
  ArrowRight,
  List,
  X,
  LogOut,
  LogIn,
  Sparkles,
  Shield,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import type { Book, Chapter } from '@/data/book-tomo-1'
import { ThemeToggle } from '@/components/ThemeToggle'

interface BookReaderProps {
  book: Book
  availableChapters: Chapter[]
  user: { email: string } | null
  hasFullAccess: boolean
  isAdmin?: boolean
  onSignOut?: () => Promise<void>
}

const ROMAN_NUMERALS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
]

export function BookReader({
  book,
  availableChapters,
  user,
  hasFullAccess,
  isAdmin = false,
  onSignOut,
}: BookReaderProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal')

  // Estado del acordeón por Tomos en el Índice
  const [isTomo1Open, setIsTomo1Open] = useState(true)
  const [isTomo2Open, setIsTomo2Open] = useState(false)

  // Cargar último capítulo leído guardado localmente si existe
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cuatro-palabras-capitulo')
      if (saved) {
        const idx = availableChapters.findIndex((c) => c.id === saved)
        if (idx !== -1) {
          setCurrentChapterIndex(idx)
        }
      }
    } catch {
      // ignore
    }
  }, [availableChapters])

  const currentChapter = availableChapters[currentChapterIndex] || availableChapters[0]

  const handleSelectChapter = (chapterId: string) => {
    const idx = availableChapters.findIndex((c) => c.id === chapterId)
    if (idx !== -1) {
      setCurrentChapterIndex(idx)
      setIsTocOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      try {
        localStorage.setItem('cuatro-palabras-capitulo', chapterId)
      } catch {
        // ignore
      }
    }
  }

  const handleNextChapter = () => {
    if (currentChapterIndex < availableChapters.length - 1) {
      const nextIdx = currentChapterIndex + 1
      setCurrentChapterIndex(nextIdx)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      try {
        localStorage.setItem('cuatro-palabras-capitulo', availableChapters[nextIdx].id)
      } catch {
        // ignore
      }
    }
  }

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIdx = currentChapterIndex - 1
      setCurrentChapterIndex(prevIdx)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      try {
        localStorage.setItem('cuatro-palabras-capitulo', availableChapters[prevIdx].id)
      } catch {
        // ignore
      }
    }
  }

  // Clases responsivas de tamaño de fuente
  const fontSizeClasses = {
    normal: 'text-[17px] sm:text-lg leading-[1.8] sm:leading-loose',
    large: 'text-[19px] sm:text-xl leading-[1.85] sm:leading-loose',
    larger: 'text-[21px] sm:text-2xl leading-[1.9] sm:leading-loose',
  }[fontSize]

  const isLastFreeChapter = currentChapter?.id === book.freeUpToChapterId
  const canGoNext = currentChapterIndex < availableChapters.length - 1
  const progressPercent = Math.round(((currentChapterIndex + 1) / availableChapters.length) * 100)

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--bg-muted)] flex flex-col justify-between transition-colors duration-200">
      {/* Barra de progreso de lectura ultra-fina en el borde superior */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--border-color)]/60 z-40">
        <div
          className="h-full bg-[var(--text-primary)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Barra de cabecera flotante adaptable a móviles */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/90 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Botón Índice e información de capítulo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsTocOpen(true)}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold px-2.5 sm:px-3 py-1.5 rounded-md border border-[var(--border-color)] hover:border-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] transition cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0"
              title="Abrir índice de contenidos"
            >
              <List className="w-4 h-4" />
              <span className="hidden xs:inline">Índice</span>
            </button>

            <div className="flex items-center gap-1.5 min-w-0 text-xs sm:text-sm">
              <span className="font-serif font-medium text-[var(--text-primary)] hidden md:inline shrink-0">
                {book.title}
              </span>
              <span className="text-[var(--border-color)] hidden md:inline">·</span>
              <span className="font-sans text-[var(--text-secondary)] truncate text-[11px] sm:text-xs">
                {currentChapter?.number ? `${currentChapter.number}: ` : ''}
                {currentChapter?.title}
              </span>
            </div>
          </div>

          {/* Controles derechos: Selector de tema, Tipografía, Acceso, Usuario */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Indicador de acceso (versión compacta en celular) */}
            {hasFullAccess ? (
              <span
                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-sans font-medium px-2 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25"
                title="Tienes acceso a la versión completa del libro"
              >
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Completo</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center text-[10px] sm:text-[11px] font-sans font-medium px-2 py-0.5 sm:py-1 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                title="Muestra de cortesía hasta el final del Capítulo 1"
              >
                <span>Muestra</span>
              </span>
            )}

            {/* Ajuste de tamaño de fuente (Accesible en celulares y escritorio) */}
            <div className="flex items-center border border-[var(--border-color)] rounded-md bg-[var(--bg-surface)] overflow-hidden text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() =>
                  setFontSize((prev) =>
                    prev === 'larger' ? 'large' : prev === 'large' ? 'normal' : 'normal'
                  )
                }
                disabled={fontSize === 'normal'}
                className="px-2 py-1 sm:py-1.5 hover:bg-[var(--bg-muted)] disabled:opacity-30 transition cursor-pointer text-[var(--text-secondary)] font-medium"
                title="Reducir tamaño de letra"
              >
                A-
              </button>
              <div className="w-px h-3.5 bg-[var(--border-color)]" />
              <button
                type="button"
                onClick={() =>
                  setFontSize((prev) =>
                    prev === 'normal' ? 'large' : prev === 'large' ? 'larger' : 'larger'
                  )
                }
                disabled={fontSize === 'larger'}
                className="px-2 py-1 sm:py-1.5 hover:bg-[var(--bg-muted)] disabled:opacity-30 transition cursor-pointer text-[var(--text-primary)] font-semibold"
                title="Aumentar tamaño de letra"
              >
                A+
              </button>
            </div>

            {/* Botón de alternancia de tema (Claro Beige / Oscuro Grafito) */}
            <ThemeToggle />

            {/* Acceso rápido a Panel Admin si el usuario es administrador */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium px-2 py-1 sm:px-2.5 sm:py-1 rounded-md bg-[var(--bg-muted)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--text-muted)] transition shadow-xs"
                title="Ir al Panel de Administración"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden xs:inline">Admin</span>
              </Link>
            )}

            {/* Estado del usuario */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs text-[var(--text-muted)] hidden lg:inline max-w-[120px] truncate"
                  title={user.email}
                >
                  {user.email}
                </span>
                {onSignOut && (
                  <form action={onSignOut}>
                    <button
                      type="submit"
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-md hover:bg-[var(--bg-muted)] transition cursor-pointer"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <Link
                href="/login?redirectTo=/leer/tomo-1"
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition shadow-xs"
              >
                <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Contenido de lectura con espaciado móvil optimizado */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex-1">
        <article className="space-y-6 sm:space-y-8 font-serif">
          {/* Cabecera del capítulo */}
          <header className="text-center mb-8 sm:mb-16 space-y-2.5 sm:space-y-3">
            {currentChapter.number && (
              <p className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--text-muted)] font-semibold">
                {currentChapter.number}
              </p>
            )}

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[var(--text-primary)] leading-tight">
              {currentChapter.title}
            </h1>

            {/* Cuatro Palabras del capítulo con flex-wrap responsivo */}
            {currentChapter.fourWords && (
              <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-sans tracking-wider text-[var(--text-muted)] uppercase">
                {currentChapter.fourWords.map((word, i) => (
                  <React.Fragment key={word}>
                    <span className="font-medium text-[var(--text-secondary)]">{word}</span>
                    {i < currentChapter.fourWords!.length - 1 && (
                      <span className="text-[var(--border-color)]">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="w-10 sm:w-12 h-px bg-[var(--border-color)] mx-auto mt-4 sm:mt-6" />
          </header>

          {/* Bloques de texto del capítulo */}
          <div
            className={`${fontSizeClasses} text-[var(--text-primary)] space-y-5 sm:space-y-6 transition-all duration-200`}
          >
            {currentChapter.content.map((block, idx) => {
              if (block.type === 'meta') {
                return (
                  <p
                    key={idx}
                    className="text-center text-[11px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[var(--text-muted)] font-medium py-1.5 sm:py-2"
                  >
                    {block.text}
                  </p>
                )
              }

              if (block.type === 'heading') {
                return (
                  <h2
                    key={idx}
                    className="text-center text-2xl sm:text-4xl font-serif text-[var(--text-primary)] py-3 sm:py-4 font-normal"
                  >
                    {block.text}
                  </h2>
                )
              }

              if (block.type === 'quote') {
                return (
                  <div
                    key={idx}
                    className="my-6 sm:my-8 pl-4 sm:pl-5 border-l-2 border-[var(--border-color)] text-[var(--text-secondary)] italic font-serif text-base sm:text-lg"
                  >
                    <p>«{block.text}»</p>
                    {block.author && (
                      <span className="block text-xs font-sans uppercase tracking-widest text-[var(--text-muted)] mt-2 not-italic">
                        — {block.author}
                      </span>
                    )}
                  </div>
                )
              }

              if (block.type === 'divider') {
                return (
                  <div key={idx} className="my-8 sm:my-10 text-center">
                    <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--text-muted)] font-semibold">
                      {block.text}
                    </span>
                    <div className="w-8 h-px bg-[var(--border-color)] mx-auto mt-2" />
                  </div>
                )
              }

              // TAREA 4: Al final de fin-tomo-1, renderizar verticalmente los capítulos del Tomo II
              if (currentChapter.id === 'fin-tomo-1' && block.type === 'paragraph') {
                if (block.text.includes('·')) {
                  const tomo2Chapters = block.text
                    .split('·')
                    .map((s) => s.trim())
                    .filter(Boolean)

                  return (
                    <div
                      key={idx}
                      className="my-8 sm:my-10 space-y-3 font-sans not-italic max-w-xl mx-auto"
                    >
                      {tomo2Chapters.map((capTitle, i) => (
                        <div
                          key={i}
                          className="p-3.5 sm:p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center gap-3 sm:gap-4 transition-all hover:border-[var(--text-muted)]"
                        >
                          <span className="font-serif text-xs uppercase font-semibold text-[var(--text-muted)] shrink-0 w-8 text-center px-1.5 py-0.5 rounded bg-[var(--bg-muted)]">
                            {ROMAN_NUMERALS[i] || `${i + 1}`}
                          </span>
                          <span className="font-serif text-sm sm:text-base text-[var(--text-primary)] font-medium">
                            {capTitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }

                // Si viene como párrafos individuales tras el divider en fin-tomo-1
                if (idx >= 3) {
                  const romanIdx = idx - 3
                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center gap-3 sm:gap-4 transition-all hover:border-[var(--text-muted)] max-w-xl mx-auto font-sans not-italic"
                    >
                      <span className="font-serif text-xs uppercase font-semibold text-[var(--text-muted)] shrink-0 w-8 text-center px-1.5 py-0.5 rounded bg-[var(--bg-muted)]">
                        {ROMAN_NUMERALS[romanIdx] || `${romanIdx + 1}`}
                      </span>
                      <span className="font-serif text-sm sm:text-base text-[var(--text-primary)] font-medium">
                        {block.text}
                      </span>
                    </div>
                  )
                }
              }

              // Párrafo convencional con letra capitular responsiva
              const isFirstParagraph = idx === 0 && Boolean(currentChapter.number)
              return (
                <p
                  key={idx}
                  className={
                    isFirstParagraph
                      ? 'first-letter:text-4xl sm:first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-2.5 sm:first-letter:mr-3 first-letter:leading-none first-letter:text-[var(--text-primary)]'
                      : ''
                  }
                >
                  {block.text}
                </p>
              )
            })}
          </div>

          {/* Bloqueo / Paywall editorial al final del Capítulo 1 */}
          {isLastFreeChapter && !hasFullAccess && (
            <section className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[var(--border-color)]">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 sm:p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] text-center relative overflow-hidden transition-colors">
                <div className="w-11 h-11 sm:w-12 sm:h-12 mx-auto rounded-full bg-[var(--bg-muted)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] mb-3.5 sm:mb-4">
                  <Lock className="w-5 h-5 stroke-[1.75]" />
                </div>

                <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
                  Muestra de Cortesía
                </p>

                <h3 className="text-xl sm:text-3xl font-serif text-[var(--text-primary)] mt-1.5 sm:mt-2 mb-2.5 sm:mb-3 font-normal">
                  Has llegado al final del Capítulo I
                </h3>

                {user ? (
                  <div className="space-y-3 sm:space-y-4 max-w-md mx-auto text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
                    <p className="leading-relaxed">
                      Hola, <strong className="text-[var(--text-primary)] font-medium">{user.email}</strong>. Tu cuenta
                      aún no tiene habilitada la versión completa del Tomo I.
                    </p>
                    <div className="p-3 sm:p-3.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[11px] sm:text-xs text-[var(--text-secondary)] text-left leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)] block mb-0.5">
                        ¿Cómo activar tu lectura?
                      </span>
                      Si ya adquiriste el libro o tienes una invitación, el autor puede darte de alta
                      directamente con tu correo. Al activarlo, se desbloquearán de inmediato los
                      Capítulos II al X y el Epílogo.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-w-md mx-auto text-xs sm:text-sm text-[var(--text-secondary)] font-sans">
                    <p className="leading-relaxed">
                      El Tomo I de <em>Cuatro Palabras</em> continúa en el <strong>Capítulo II: Vida, Paz,
                      Situaciones, Amor</strong>, abarcando 10 capítulos y 37 páginas.
                    </p>
                    <p className="text-[var(--text-muted)] text-[11px] sm:text-xs">
                      Inicia sesión con tu correo electrónico para continuar tu lectura si ya dispones de
                      acceso concedido.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/login?redirectTo=/leer/tomo-1"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition duration-150 shadow-xs cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Iniciar sesión / Registrarse</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Navegación inferior entre capítulos */}
          <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-sans text-[var(--text-muted)]">
            <button
              type="button"
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded border border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Capítulo anterior</span>
            </button>

            <span className="font-serif italic text-[var(--text-muted)] text-center text-xs">
              Páginas {currentChapter.pageStart} a {currentChapter.pageEnd} de {book.totalPages}
            </span>

            {canGoNext ? (
              <button
                type="button"
                onClick={handleNextChapter}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition cursor-pointer shadow-xs font-medium"
              >
                <span>Siguiente capítulo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : isLastFreeChapter && !hasFullAccess ? (
              <Link
                href="/login?redirectTo=/leer/tomo-1"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 transition font-medium"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Iniciar sesión / Registrarse</span>
              </Link>
            ) : (
              <span className="text-[var(--text-muted)] italic text-center w-full sm:w-auto">Fin del Tomo I</span>
            )}
          </footer>
        </article>
      </main>

      {/* Barra de pie ultra-minimalista */}
      <footer className="py-4 text-center text-[11px] text-[var(--text-muted)] font-serif border-t border-[var(--border-color)]/60">
        Cuatro Palabras · Tomo I
      </footer>

      {/* Cajón lateral / Modal de Índice (Tabla de Contenidos) */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo traslúcido para cerrar con toque */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsTocOpen(false)}
          />

          {/* Panel lateral adaptable: cubre 88% en celular y max-w-md en desktop */}
          <aside className="relative ml-auto w-[88vw] sm:w-full sm:max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-color)] h-full p-5 sm:p-8 flex flex-col shadow-2xl z-10 overflow-y-auto transition-colors">
            <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[var(--border-color)]">
              <div>
                <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
                  Índice General
                </p>
                <h2 className="text-xl sm:text-2xl font-serif text-[var(--text-primary)] font-normal mt-0.5 sm:mt-1">
                  {book.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsTocOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-muted)] transition cursor-pointer"
                title="Cerrar índice"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAREA 3: Lista de capítulos en el índice agrupada por Tomos (Acordeón) */}
            <div className="py-4 sm:py-6 flex-1 space-y-4">
              {/* Acordeón 1: Tomo I */}
              <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-primary)]/50">
                <button
                  type="button"
                  onClick={() => setIsTomo1Open(!isTomo1Open)}
                  className="w-full flex items-center justify-between p-3.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]/60 transition cursor-pointer text-left"
                >
                  <div className="min-w-0 pr-2">
                    <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                      Tomo I
                    </span>
                    <span className="font-serif text-sm font-medium text-[var(--text-primary)] truncate block">
                      Comprender, Aceptar, Crecer, Avanzar
                    </span>
                  </div>
                  {isTomo1Open ? (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform" />
                  )}
                </button>

                {isTomo1Open && (
                  <div className="p-2 space-y-1 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
                    {book.chapters.map((chapter) => {
                      const isAvailable = availableChapters.some((c) => c.id === chapter.id)
                      const isCurrent = currentChapter.id === chapter.id

                      return (
                        <div key={chapter.id}>
                          {isAvailable ? (
                            <button
                              type="button"
                              onClick={() => handleSelectChapter(chapter.id)}
                              className={`w-full text-left px-3 py-2.5 sm:py-3 rounded-lg flex items-center justify-between group transition cursor-pointer min-h-[46px] ${
                                isCurrent
                                  ? 'bg-[var(--bg-muted)] text-[var(--text-primary)] font-medium border border-[var(--border-color)]'
                                  : 'hover:bg-[var(--bg-muted)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="truncate pr-3">
                                {chapter.number && (
                                  <span className="block text-[10px] font-sans uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
                                    {chapter.number}
                                  </span>
                                )}
                                <span className="font-serif text-sm group-hover:text-[var(--text-primary)]">
                                  {chapter.title}
                                </span>
                              </div>
                              <span className="text-[11px] sm:text-xs font-sans text-[var(--text-muted)] shrink-0">
                                p. {chapter.pageStart}
                              </span>
                            </button>
                          ) : (
                            <div className="w-full text-left px-3 py-2.5 sm:py-3 rounded-lg flex items-center justify-between opacity-50 bg-[var(--bg-primary)]/40 cursor-not-allowed min-h-[46px] border border-transparent">
                              <div className="truncate pr-3">
                                {chapter.number && (
                                  <span className="block text-[10px] font-sans uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
                                    {chapter.number}
                                  </span>
                                )}
                                <span className="font-serif text-sm text-[var(--text-muted)]">
                                  {chapter.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-sans text-[var(--text-muted)] shrink-0">
                                <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                <span>p. {chapter.pageStart}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Acordeón 2: Tomo II */}
              <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-primary)]/50">
                <button
                  type="button"
                  onClick={() => setIsTomo2Open(!isTomo2Open)}
                  className="w-full flex items-center justify-between p-3.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)]/60 transition cursor-pointer text-left"
                >
                  <div className="min-w-0 pr-2">
                    <span className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--text-muted)] font-semibold">
                      Tomo II
                    </span>
                    <span className="font-serif text-sm font-medium text-[var(--text-primary)] truncate block">
                      Próximamente
                    </span>
                  </div>
                  {isTomo2Open ? (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform" />
                  )}
                </button>

                {isTomo2Open && (
                  <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] text-center space-y-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-[11px] font-sans uppercase tracking-wider font-semibold rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-color)]">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Próximamente · En desarrollo
                    </span>
                    <p className="font-serif italic text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                      «Nuevas combinaciones de cuatro palabras en proceso de escritura.»
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Pie del índice */}
            <div className="pt-4 sm:pt-6 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] font-sans space-y-3">
              {!hasFullAccess && (
                <div className="p-3 bg-[var(--bg-muted)] rounded-lg text-[11px] sm:text-xs text-[var(--text-secondary)] leading-relaxed border border-[var(--border-color)]">
                  <span className="font-semibold text-[var(--text-primary)] block mb-0.5">Acceso Parcial</span>
                  Los capítulos marcados con candado se desbloquean al autorizar tu correo en la plataforma.
                </div>
              )}
              <div className="text-center pt-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition text-xs"
                  onClick={() => setIsTocOpen(false)}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a la portada principal</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
