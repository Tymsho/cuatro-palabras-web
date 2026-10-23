'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('cuatro-palabras-theme')
    if (
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('light')
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try {
      localStorage.setItem('cuatro-palabras-theme', next)
    } catch {
      // ignore
    }

    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Prevenir layout shift / flash antes de montaje en el cliente
  if (!mounted) {
    return (
      <button
        type="button"
        className={`p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] opacity-80 ${className}`}
        aria-label="Cargando tema"
      >
        <span className="w-4 h-4 block" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center justify-center shadow-xs ${className}`}
      title={theme === 'light' ? 'Activar modo oscuro (grafito cálido)' : 'Activar modo claro (beige cálido)'}
      aria-label="Alternar tema de lectura"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12 stroke-[1.75]" />
      ) : (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45 stroke-[1.75]" />
      )}
    </button>
  )
}
