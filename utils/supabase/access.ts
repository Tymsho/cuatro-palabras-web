import { createClient } from '@/utils/supabase/server'

/**
 * Verifica si un correo electrónico pertenece a la lista de administradores autorizados.
 * Lee la variable de entorno ADMIN_EMAILS (separados por coma).
 */
export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false

  const cleanEmail = email.trim().toLowerCase()
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ALLOWED_READERS_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return adminEmails.includes(cleanEmail)
}

/**
 * Verifica si un usuario (por su email) tiene acceso a la versión completa del libro.
 * 
 * Estrategia de verificación dual:
 * 1. Variables de entorno (ADMIN_EMAILS o ALLOWED_READERS_EMAILS): Permite acceso inmediato a administradores
 *    o lista de emails sin necesidad de consultar la base de datos.
 * 2. Tabla 'allowed_readers' en Supabase: Permite agregar o revocar acceso a lectores
 *    directamente desde la base de datos o desde el panel de administración.
 */
export async function checkUserFullAccess(email?: string | null): Promise<boolean> {
  if (!email) return false

  const cleanEmail = email.trim().toLowerCase()

  // 1. Verificación rápida: Si es administrador, tiene acceso irrestricto
  if (checkIsAdmin(cleanEmail)) {
    return true
  }

  // Verificación por variable de entorno de lectores adicionales
  const envAllowed = (process.env.ALLOWED_READERS_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (envAllowed.includes(cleanEmail)) {
    return true
  }

  // 2. Verificación en la tabla allowed_readers de Supabase
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('allowed_readers')
      .select('has_full_access')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (error) {
      console.warn('Nota: Consulta a allowed_readers omitida o no encontrada:', error.message)
      return false
    }

    return Boolean(data?.has_full_access)
  } catch (err) {
    console.error('Error al verificar acceso de usuario en Supabase:', err)
    return false
  }
}
