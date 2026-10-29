import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { checkUserFullAccess, checkIsAdmin } from '@/utils/supabase/access'
import { TOMO_1, Chapter } from '@/data/book-tomo-1'
import { BookReader } from '@/components/BookReader'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Cuatro Palabras · Tomo I (Lectura Online)',
  description: 'Comprender. Aceptar. Crecer. Avanzar. Por Maximiliano Denis Urquiola.',
}

async function AsyncReader() {
  await connection()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Verificamos si el usuario actual cuenta con permiso para leer el libro completo y si es admin
  const hasFullAccess = await checkUserFullAccess(user?.email)
  const isAdmin = checkIsAdmin(user?.email)

  // 2. OBTENCIÓN SEGURA DEL CONTENIDO:
  // - Si el lector tiene acceso confirmado, traemos los textos protegidos directamente
  //   desde la base de datos de Supabase (protegida por Row Level Security).
  // - Si el lector es libre / anónimo, únicamente se envían los capítulos gratuitos
  //   (Portada, Dedicatoria, Prólogo, Introducción y Capítulo I).
  let availableChapters: Chapter[] = []

  if (hasFullAccess) {
    const { data: dbChapters, error } = await supabase
      .from('book_chapters')
      .select('chapter_id, content')
      .eq('book_id', 'tomo-1')
      .order('chapter_order', { ascending: true })

    if (!error && dbChapters && dbChapters.length > 0) {
      const contentMap = new Map<string, Chapter['content']>(
        dbChapters.map((item) => [item.chapter_id, item.content as Chapter['content']])
      )

      availableChapters = TOMO_1.chapters.map((ch) => {
        if (contentMap.has(ch.id)) {
          return {
            ...ch,
            content: contentMap.get(ch.id) || [],
          }
        }
        return ch
      })
    } else {
      // Si la tabla aún no se ha poblado o hubo un error temporal, mantenemos los capítulos disponibles
      availableChapters = TOMO_1.chapters.filter((ch) => ch.isFree)
    }
  } else {
    availableChapters = TOMO_1.chapters.filter((ch) => ch.isFree)
  }

  async function handleSignOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/leer/tomo-1')
  }

  return (
    <BookReader
      book={TOMO_1}
      availableChapters={availableChapters}
      user={user?.email ? { email: user.email } : null}
      hasFullAccess={hasFullAccess}
      isAdmin={isAdmin}
      onSignOut={handleSignOut}
    />
  )
}

export default function TomoUnoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-[var(--text-muted)] font-sans text-xs gap-3 transition-colors duration-200">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--border-color)] border-t-[var(--text-primary)] animate-spin" />
          <p className="font-serif italic text-[var(--text-secondary)]">Abriendo Cuatro Palabras...</p>
        </div>
      }
    >
      <AsyncReader />
    </Suspense>
  )
}
