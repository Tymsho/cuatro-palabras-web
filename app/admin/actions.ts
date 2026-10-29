'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { checkIsAdmin } from '@/utils/supabase/access'

export interface ActionResponse {
  success?: boolean
  error?: string
  message?: string
}

/**
 * Valida que la sesión actual pertenezca a un administrador autorizado.
 */
async function verifyAdminSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !checkIsAdmin(user.email)) {
    throw new Error('No autorizado. Se requieren credenciales de administrador.')
  }

  return user
}

/**
 * Server Action para dar de alta o actualizar un lector con acceso completo.
 */
export async function addOrEnableReaderAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    await verifyAdminSession()

    const rawEmail = formData.get('email')
    const rawNotes = formData.get('notes')

    const email = String(rawEmail || '').trim().toLowerCase()
    const notes = String(rawNotes || '').trim() || null

    if (!email || !email.includes('@')) {
      return { error: 'Por favor, ingresa un correo electrónico válido.' }
    }

    const adminClient = createAdminClient()

    const { error } = await adminClient.from('allowed_readers').upsert(
      {
        email,
        notes,
        has_full_access: true,
        granted_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('Error al agregar lector en allowed_readers:', error)
      return { error: `Error en la base de datos: ${error.message}` }
    }

    revalidatePath('/admin')
    revalidatePath('/leer/tomo-1')

    return {
      success: true,
      message: `El lector ${email} ha sido habilitado con éxito.`,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error inesperado al agregar lector.'
    return { error: errorMsg }
  }
}

/**
 * Server Action para alternar el acceso (Pausar / Reactivar) de un lector.
 */
export async function toggleReaderAccessAction(
  email: string,
  currentStatus: boolean
): Promise<ActionResponse> {
  try {
    await verifyAdminSession()

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      return { error: 'Correo inválido.' }
    }

    const adminClient = createAdminClient()

    const newStatus = !currentStatus
    const { error } = await adminClient
      .from('allowed_readers')
      .update({ has_full_access: newStatus })
      .eq('email', cleanEmail)

    if (error) {
      console.error('Error al actualizar acceso del lector:', error)
      return { error: `Error en base de datos: ${error.message}` }
    }

    revalidatePath('/admin')
    revalidatePath('/leer/tomo-1')

    return {
      success: true,
      message: `Acceso ${newStatus ? 'reactivado' : 'pausado'} para ${cleanEmail}.`,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error inesperado al modificar acceso.'
    return { error: errorMsg }
  }
}

/**
 * Server Action para eliminar permanentemente un lector de la lista de autorizados.
 */
export async function deleteReaderAction(email: string): Promise<ActionResponse> {
  try {
    await verifyAdminSession()

    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) {
      return { error: 'Correo inválido.' }
    }

    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('allowed_readers')
      .delete()
      .eq('email', cleanEmail)

    if (error) {
      console.error('Error al eliminar lector de allowed_readers:', error)
      return { error: `Error en base de datos: ${error.message}` }
    }

    revalidatePath('/admin')
    revalidatePath('/leer/tomo-1')

    return {
      success: true,
      message: `Lector ${cleanEmail} eliminado de la lista.`,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error inesperado al eliminar lector.'
    return { error: errorMsg }
  }
}
