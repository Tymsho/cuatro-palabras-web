# 📖 Cuatro Palabras · Plataforma de Lectura Online

> **Comprender · Aceptar · Crecer · Avanzar**  
> *«Hay historias escritas para ser leídas con la calma del papel y la intimidad del silencio.»*

🌐 **Idiomas:** [🇺🇸 Read in English](./README.md) | **Español**

---

## Descripción General

**Cuatro Palabras** es una plataforma web de lectura pausada y minimalista diseñada para el libro filosófico y reflexivo ***Cuatro Palabras · Tomo I***, escrito por **Maximiliano Denis Urquiola**.

Cada capítulo reúne cuatro conceptos que, puestos a convivir en un mismo espacio, generan una pequeña ecuación filosófica—como *Resiliencia, Familia, Olvido, Perdón* o *Pasado, Presente, Futuro, Nada*—invitando al lector a hacer una pausa. La aplicación está construida con Next.js 16, React 19, Tailwind CSS v4 y Supabase para ofrecer una experiencia editorial íntima y libre de distracciones, garantizando al mismo tiempo la protección de los derechos de autor y el control de acceso a la obra completa.

---

## ✨ Características Principales

### 📚 Experiencia de Lectura Editorial (`/leer/tomo-1`)
- **Temas de Papel Cálido y Grafito:** Paletas de colores semánticas diseñadas para el descanso visual en lecturas prolongadas: **Beige Cálido** (`#F2ECE1`) en modo claro y **Grafito Cálido** (`#262628`) en modo oscuro, inicializados sin parpadeos (FOUC) mediante un script inline en la cabecera.
- **Control Tipográfico:** Ajuste de tamaño de letra en tiempo real (`A-` / `A+`) en tres niveles responsivos (*Normal*, *Grande*, *Más grande*), acompañado de tipografía serif clásica y letras capitulares (*drop caps*) al inicio de cada capítulo numerado.
- **Progreso de Lectura Automático:** Barra superior ultra-fina de progreso y guardado automático del último capítulo leído en `localStorage` (`cuatro-palabras-capitulo`).
- **Índice General por Tomos:** Panel lateral deslizable organizado en acordeones por tomos (*Tomo I* y adelanto del *Tomo II*), con numeración de páginas e indicadores de candado para los capítulos protegidos.

### 🔒 Protección de Derechos de Autor y Control de Acceso de Doble Capa
- **Sin Textos Protegidos en el Repositorio:** En el código fuente (`data/book-tomo-1.ts`) únicamente reside el contenido de la muestra gratuita (*Portada*, *Dedicatoria*, *Prólogo*, *Introducción* y *Capítulo I*).
- **Inyección desde Servidor + Row Level Security (RLS):** Los textos íntegros de los Capítulos II al X, el Epílogo y el cierre del Tomo I se almacenan como bloques `JSONB` en Supabase (`public.book_chapters`) protegidos mediante políticas **Row Level Security (RLS)** de PostgreSQL. El servidor consulta e inyecta los capítulos protegidos únicamente cuando el lector autenticado cuenta con acceso confirmado.
- **Verificación Dual de Acceso:** Los permisos de lectura se comprueban combinando variables de entorno (`ADMIN_EMAILS`, `ALLOWED_READERS_EMAILS`) y consultas dinámicas a la tabla `public.allowed_readers` en Supabase.

### 🔐 Autenticación Multimodo (`/login`)
- Impulsada por **Supabase Auth (`@supabase/ssr`)** con refresco de sesión en servidor mediante Middleware de Next.js.
- Ofrece tres modalidades de ingreso:
  1. **Inicio de sesión con Correo y Contraseña**
  2. **Registro de Nueva Cuenta**
  3. **Enlace Mágico (Magic Link / OTP)** sin contraseña enviado directamente al correo del lector y procesado en `/auth/callback`.

### 🛡️ Panel de Administración (`/admin`)
- **Acceso Blindado en Servidor:** Exclusivo para los correos configurados en `ADMIN_EMAILS` (validado tanto en Middleware como en Server Components y Server Actions).
- **Gestión Integral de Lectores:** Permite dar de alta compradores por correo electrónico, añadir notas o referencias de pago (ej. comprobante de Mercado Pago), pausar o reactivar el acceso con un clic y eliminar registros con confirmación integrada.
- **Estadísticas y Buscador en Vivo:** Tarjetas de resumen en tiempo real (*Total Registrados*, *Lectores Habilitados* y *Lectores Pausados*) y filtrado reactivo por correo electrónico o nota.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | [Next.js 16.4](https://nextjs.org/) (App Router, Server Components, Server Actions, Turbopack) |
| **Librería UI** | [React 19.3](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/turbopack`) + Variables CSS Semánticas |
| **Autenticación y BD** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`) |
| **Iconografía** | [Lucide React](https://lucide.dev/) |

---

## 📂 Estructura del Proyecto

```text
cuatro-palabras-web/
├── app/
│   ├── admin/
│   │   ├── actions.ts          # Server Actions para agregar, pausar/activar y eliminar lectores
│   │   └── page.tsx            # Página del Panel de Administración protegida en el servidor
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # Intercambio de código PKCE para enlaces mágicos y confirmación
│   ├── leer/
│   │   └── tomo-1/
│   │       └── page.tsx        # Server Component que verifica permisos e inyecta capítulos
│   ├── login/
│   │   └── page.tsx            # Interfaz de acceso (Iniciar sesión, Crear cuenta, Magic Link)
│   ├── globals.css             # Configuración de Tailwind v4 y variables de tema claro/oscuro
│   ├── layout.tsx              # Layout raíz, metadatos, viewport y script anti-flash de tema
│   └── page.tsx                # Portada principal (Landing Page editorial)
├── components/
│   ├── AdminDashboard.tsx      # Panel interactivo para administrar lectores autorizados
│   ├── BookReader.tsx          # Lector del libro, índice lateral, controles de fuente y tema
│   └── ThemeToggle.tsx         # Selector de modo Claro (Beige Cálido) / Oscuro (Grafito)
├── data/
│   └── book-tomo-1.ts          # Estructura del Tomo I y textos de la muestra gratuita
├── supabase/
│   └── setup_and_seed_book.sql # Script SQL: tablas, políticas RLS e inserción de capítulos
├── utils/
│   └── supabase/
│       ├── access.ts           # Lógica de verificación de administradores y acceso completo
│       ├── admin.ts            # Cliente Supabase con Service Role para acciones de admin
│       ├── client.ts           # Cliente Supabase para componentes de navegador
│       ├── middleware.ts       # Refresco de sesiones y protección de rutas
│       └── server.ts           # Cliente Supabase para Server Components y Server Actions
├── middleware.ts               # Punto de entrada del Middleware de Next.js
├── next.config.ts              # Configuración de Next.js 16 (Turbopack, cacheComponents)
└── package.json
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Configuración Pública de Supabase
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-clave-anon-publica"

# Clave Service Role de Supabase (Necesaria para gestionar lectores en /admin, solo en servidor)
SUPABASE_SERVICE_ROLE_KEY="tu-clave-secreta-service-role"

# Correos de Administradores (Separados por coma; otorgan acceso a /admin y al libro completo)
ADMIN_EMAILS="admin@ejemplo.com"

# Opcional: Lista adicional de correos con acceso completo vía entorno (Separados por coma)
ALLOWED_READERS_EMAILS="lector1@ejemplo.com,lector2@ejemplo.com"
```

> [!IMPORTANT]
> Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente ni subas el archivo `.env.local` a tu repositorio Git. Esta clave se utiliza exclusivamente en el servidor dentro de `utils/supabase/admin.ts`.

---

## 🗄️ Configuración de la Base de Datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Abre el **SQL Editor** en el panel de control de tu proyecto de Supabase.
3. Copia y ejecuta el contenido íntegro del archivo [`supabase/setup_and_seed_book.sql`](./supabase/setup_and_seed_book.sql). Este script realizará automáticamente:
   - Creación de la tabla `public.allowed_readers` (`email`, `has_full_access`, `granted_at`, `notes`).
   - Creación de la tabla `public.book_chapters` (`chapter_id`, `book_id`, `chapter_order`, `is_free`, `content`, `updated_at`).
   - Activación de **Row Level Security (RLS)** en ambas tablas para asegurar que los capítulos protegidos solo puedan ser consultados por usuarios autenticados cuyo correo figure en `allowed_readers` con `has_full_access = true`.
   - Inserción del texto completo de los **Capítulos II al X**, el **Epílogo** y el **Fin del Tomo I / Adelanto del Tomo II**.
4. En el panel de Supabase, dirígete a **Authentication ➔ URL Configuration** y agrega la ruta de retorno en **Redirect URLs**:
   - Entorno local: `http://localhost:3000/auth/callback`
   - Producción: `https://tu-dominio.com/auth/callback`

---

## 🚀 Instalación y Ejecución Local

### Requisitos Previos
- **Node.js** `>= 20.x`
- **npm**, **pnpm**, **yarn** o **bun**
- Un proyecto configurado en **Supabase**

### Pasos para Iniciar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar las variables de entorno:**
   Crea el archivo `.env.local` en la raíz siguiendo la sección [Variables de Entorno](#️-variables-de-entorno).

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Ingresa a [http://localhost:3000](http://localhost:3000).
   - **Portada Principal:** `http://localhost:3000`
   - **Lector del Libro:** `http://localhost:3000/leer/tomo-1`
   - **Acceso / Registro:** `http://localhost:3000/login`
   - **Panel de Administración:** `http://localhost:3000/admin` *(requiere iniciar sesión con un correo incluido en `ADMIN_EMAILS`)*

### Compilación para Producción

```bash
npm run build
npm run start
```

---

## 📖 Estructura de la Obra (*Tomo I*)

| Sección / Capítulo | Título / Las Cuatro Palabras | Páginas | Nivel de Acceso |
| :--- | :--- | :---: | :---: |
| **Portada** | *Cuatro Palabras · Tomo I* | 1 | 🟢 Muestra Gratuita |
| **Dedicatoria** | *Dedicatoria* | 2 | 🟢 Muestra Gratuita |
| **Prólogo** | *Prólogo* | 4–5 | 🟢 Muestra Gratuita |
| **Introducción** | *Introducción* | 6 | 🟢 Muestra Gratuita |
| **Capítulo I** | *Resiliencia · Familia · Olvido · Perdón* | 7–8 | 🟢 Muestra Gratuita |
| **Capítulo II** | *Vida · Paz · Situaciones · Amor* | 9–11 | 🔒 Lectores Autorizados |
| **Capítulo III** | *Pasado · Presente · Futuro · Nada* | 12–14 | 🔒 Lectores Autorizados |
| **Capítulo IV** | *Trabajo · Vocación · Cansancio · Propósito* | 15–17 | 🔒 Lectores Autorizados |
| **Capítulo V** | *Dinero · Deseo · Miedo · Suficiencia* | 18–19 | 🔒 Lectores Autorizados |
| **Capítulo VI** | *Guerra · Enemigo · Silencio · Humanidad* | 20–22 | 🔒 Lectores Autorizados |
| **Capítulo VII** | *Emoción · Cuerpo · Silencio · Verdad* | 23–25 | 🔒 Lectores Autorizados |
| **Capítulo VIII** | *Ser · Vacío · Sentido · Asombro* | 26–27 | 🔒 Lectores Autorizados |
| **Capítulo IX** | *Enfoque · Disciplina · Constancia · Éxito* | 29–31 | 🔒 Lectores Autorizados |
| **Capítulo X** | *Atención · Ruido · Elección · Claridad* | 32–33 | 🔒 Lectores Autorizados |
| **Epílogo** | *Epílogo* | 35–36 | 🔒 Lectores Autorizados |
| **Fin del Tomo I** | *Fin del Tomo I y Adelanto del Tomo II* | 37 | 🔒 Lectores Autorizados |

---

## ✍️ Autoría y Derechos

Escrito y desarrollado para **Cuatro Palabras** por **Maximiliano Denis Urquiola**.  
© Todos los derechos reservados sobre la obra literaria y los textos de *Cuatro Palabras*.

