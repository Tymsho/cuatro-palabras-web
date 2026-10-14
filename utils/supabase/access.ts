import { createClient } from '@/utils/supabase/server'

/**
 * Verifica si un usuario (por su email) tiene acceso a la versión completa del libro.
 * 
 * Estrategia de verificación dual:
 * 1. Variables de entorno (ALLOWED_READERS o ADMIN_EMAILS): Permite acceso inmediato a administradores
 *    o lista de emails sin necesidad de consultar la base de datos.
 * 2. Tabla 'allowed_readers' en Supabase: Permite agregar o revocar acceso a lectores
 *    directamente desde el Table Editor del Dashboard de Supabase.
 */
export async function checkUserFullAccess(email?: string | null): Promise<boolean> {
  if (!email) return false

  const cleanEmail = email.trim().toLowerCase()

  // 1. Verificación rápida por variable de entorno (si existe)
  const envAllowed = (process.env.ALLOWED_READERS_EMAILS || process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (envAllowed.includes(cleanEmail)) {
    return true
  }

  // 2. Verificación en la base de datos Supabase
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('allowed_readers')
      .select('has_full_access')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (error) {
      // Si la tabla aún no fue creada en Supabase, no rompemos la app
      console.warn('Nota: Consulta a allowed_readers omitida o no encontrada:', error.message)
      return false
    }

    return Boolean(data?.has_full_access)
  } catch (err) {
    console.error('Error al verificar acceso de usuario en Supabase:', err)
    return false
  }
}
