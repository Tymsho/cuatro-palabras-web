import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col justify-between selection:bg-[var(--bg-muted)] transition-colors duration-200">
      {/* Cabecera */}
      <header className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
          <span className="font-serif font-medium text-base sm:text-lg tracking-tight">
            Cuatro Palabras
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold px-3 sm:px-4 py-2 border border-[var(--border-color)] hover:border-[var(--text-primary)] rounded-lg transition text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] shadow-xs"
          >
            Acceder
          </Link>
        </div>
      </header>

      {/* Hero Principal */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center flex flex-col items-center flex-1 justify-center">
        <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[var(--text-muted)] font-semibold mb-3 sm:mb-4">
          Una plataforma de lectura pausada
        </span>

        <h1 className="text-4xl sm:text-6xl font-serif text-[var(--text-primary)] tracking-tight leading-tight mb-4 sm:mb-6">
          Cuatro Palabras
        </h1>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-sans tracking-wider text-[var(--text-secondary)] uppercase mb-6 sm:mb-8">
          <span>Comprender</span>
          <span className="text-[var(--border-color)]">·</span>
          <span>Aceptar</span>
          <span className="text-[var(--border-color)]">·</span>
          <span>Crecer</span>
          <span className="text-[var(--border-color)]">·</span>
          <span>Avanzar</span>
        </div>

        <p className="text-base sm:text-xl text-[var(--text-secondary)] font-serif italic max-w-xl mb-8 sm:mb-12 leading-relaxed px-2">
          «Hay historias escritas para ser leídas con la calma del papel y la intimidad del silencio.»
        </p>

        {/* Acciones principales adaptables a pantallas móviles */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
          <Link
            href="/leer/tomo-1"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-7 py-3.5 rounded-lg text-sm font-medium hover:opacity-90 transition shadow-xs group min-h-[48px]"
          >
            <span>Comenzar la Lectura (Muestra Gratuita)</span>
            <ArrowRight className="w-4 h-4 text-[var(--bg-primary)] group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-5 py-3.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--text-primary)] bg-[var(--bg-surface)] transition min-h-[48px]"
          >
            Iniciar sesión / Registrarse
          </Link>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="border-t border-[var(--border-color)] py-6 sm:py-8 text-center text-[11px] sm:text-xs text-[var(--text-muted)] font-serif px-4">
        <p>© Cuatro Palabras. Escrito por Maximiliano Denis Urquiola.</p>
      </footer>
    </div>
  );
}
