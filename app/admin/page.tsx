import { Suspense } from 'react'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { checkIsAdmin } from '@/utils/supabase/access'
import { AdminDashboard, type AllowedReader } from '@/components/AdminDashboard'

export const metadata = {
  title: 'Panel de Administración · Cuatro Palabras',
  description: 'Gestión exclusiva de lectores autorizados para el libro Cuatro Palabras.',
}

async function AsyncAdminContent() {
  await connection()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Verificación de seguridad en el servidor:
  // Si no hay usuario autenticado o su correo no es administrador, redirigir inmediatamente a la lectura.
  if (!user || !checkIsAdmin(user.email)) {
    redirect('/leer/tomo-1')
  }

  // 2. Consulta de lectores autorizados con cliente Service Role (Admin)
  let readers: AllowedReader[] = []
  try {
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('allowed_readers')
      .select('email, has_full_access, granted_at, notes')
      .order('granted_at', { ascending: false })

    if (error) {
      console.error('Error al consultar allowed_readers desde AdminPage:', error.message)
    } else if (data) {
      readers = data as AllowedReader[]
    }
  } catch (err) {
    console.error('Excepción al conectar con base de datos en AdminPage:', err)
  }

  const isServiceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <AdminDashboard
      initialReaders={readers}
      adminEmail={user.email || ''}
      isServiceRoleConfigured={isServiceRoleConfigured}
    />
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-[var(--text-muted)] font-sans text-xs gap-3 transition-colors duration-200">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--border-color)] border-t-[var(--text-primary)] animate-spin" />
          <p className="font-serif italic text-[var(--text-secondary)]">
            Cargando Panel de Administración...
          </p>
        </div>
      }
    >
      <AsyncAdminContent />
    </Suspense>
  )
}
