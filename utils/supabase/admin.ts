import { createClient } from '@supabase/supabase-js'

/**
 * Crea una instancia de cliente Supabase para operaciones administrativas.
 * Utiliza SUPABASE_SERVICE_ROLE_KEY si está presente, con respaldo a ANON_KEY.
 * 
 * SEGURIDAD CRÍTICA:
 * - Solo debe invocarse en entornos del lado del servidor (Server Components, Server Actions o Route Handlers).
 * - Nunca debe enviarse al cliente ni ejecutarse sin antes validar `checkIsAdmin(user.email)`.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Configuración incompleta: Faltan variables de entorno de Supabase en .env.local.'
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
