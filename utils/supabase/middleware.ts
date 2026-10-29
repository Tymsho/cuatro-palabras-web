import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Siempre usamos getUser() en el servidor y middleware, ya que valida el token
  // contra la base de datos de Supabase, a diferencia de getSession() que puede ser falsificado.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 1. Protección del Panel de Administración para visitantes no autenticados
  if (!user && pathname.startsWith('/admin')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Otras rutas que requieran autenticación forzada
  if (!user && pathname.startsWith('/leer/privado')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 3. Si el usuario ya está autenticado e ingresa a /login, lo dirigimos a su destino o a la lectura
  if (user && pathname === '/login') {
    const target = request.nextUrl.searchParams.get('redirectTo') || '/leer/tomo-1'
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = target.startsWith('/') ? target : '/leer/tomo-1'
    redirectUrl.searchParams.delete('redirectTo')
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
