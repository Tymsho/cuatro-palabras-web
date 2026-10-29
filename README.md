# 📖 Cuatro Palabras · Online Reading Platform

> **Comprender · Aceptar · Crecer · Avanzar** *(Understand · Accept · Grow · Move Forward)*  
> *“There are stories written to be read with the calm of paper and the intimacy of silence.”*

🌐 **Languages:** **English** | [🇪🇸 Leer en Español](./README-Es.md)

---

## Overview

**Cuatro Palabras** (*Four Words*) is a minimalist, slow-reading web platform created for the philosophical and reflective book ***Cuatro Palabras · Tomo I*** by **Maximiliano Denis Urquiola**.

Each chapter brings together four seemingly distinct concepts—such as *Resilience, Family, Oblivion, Forgiveness* or *Time, Past, Present, Nothingness*—placing them in dialogue to spark reflection. The platform is engineered with Next.js 16, React 19, Tailwind CSS v4, and Supabase to deliver an intimate, distraction-free editorial experience while strictly protecting copyright and full-book access.

---

## ✨ Key Features

### 📚 Editorial Reading Experience (`/leer/tomo-1`)
- **Warm Paper & Graphite Themes:** Custom semantic color palettes designed for long-form reading comfort—**Warm Beige** (`#F2ECE1`) for light mode and **Warm Graphite** (`#262628`) for dark mode—initialized via an inline head script to prevent theme flashing (FOUC).
- **Typography Controls:** Real-time font size adjustment (`A-` / `A+`) across three responsive scales (*Normal*, *Large*, *Larger*), paired with classic serif typography and editorial drop caps on chapter openings.
- **Automatic Reading Progress:** Top-edge progress indicator and automatic persistence of the last read chapter in `localStorage` (`cuatro-palabras-capitulo`).
- **Accordion Table of Contents:** Slide-over index drawer organized by volumes (*Tomo I* and a preview of upcoming *Tomo II*), displaying page ranges and lock status indicators for protected chapters.

### 🔒 Copyright Protection & Dual-Layer Access Control
- **Zero Protected Text in Repository:** Only the courtesy sample (*Cover*, *Dedication*, *Prologue*, *Introduction*, and *Chapter I*) is stored in static code (`data/book-tomo-1.ts`).
- **Server-Side Content Injection + RLS:** Chapters II through X, the Epilogue, and the Volume II preview are stored as structured JSONB blocks in Supabase (`public.book_chapters`) protected by PostgreSQL **Row Level Security (RLS)**. Protected content is fetched and injected on the server only after verifying the reader's authorization.
- **Dual Verification Strategy:** Reader authorization is verified through environment variables (`ADMIN_EMAILS`, `ALLOWED_READERS_EMAILS`) and dynamically against the `public.allowed_readers` table in Supabase.

### 🔐 Multi-Mode Authentication (`/login`)
- Powered by **Supabase Auth (`@supabase/ssr`)** with server-side session refresh via Next.js Middleware.
- Supports three seamless authentication flows:
  1. **Email & Password Sign-In**
  2. **New Account Registration**
  3. **Passwordless Magic Link (OTP)** sent directly to the reader's inbox, handled via `/auth/callback`.

### 🛡️ Administrator Dashboard (`/admin`)
- **Server-Guarded Access:** Restricted exclusively to emails listed in `ADMIN_EMAILS` (enforced in both Middleware, Server Components, and Server Actions).
- **Reader Management:** Add or enable buyers by email, attach payment/reference notes (e.g., Mercado Pago ID), pause or resume access with one click, and permanently remove entries with inline confirmation.
- **Live Metrics & Search:** Instant overview of *Total Registered*, *Active Readers*, and *Paused Readers*, plus real-time client filtering by email or note.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16.4](https://nextjs.org/) (App Router, Server Components, Server Actions, Turbopack) |
| **UI Library** | [React 19.3](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/turbopack`) + CSS Custom Properties |
| **Authentication & DB** | [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📂 Project Structure

```text
cuatro-palabras-web/
├── app/
│   ├── admin/
│   │   ├── actions.ts          # Server Actions to add, toggle, and delete authorized readers
│   │   └── page.tsx            # Server-protected Administrator Dashboard page
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # OAuth / Magic Link PKCE code exchange handler
│   ├── leer/
│   │   └── tomo-1/
│   │       └── page.tsx        # Server Component fetching chapters & checking reader access
│   ├── login/
│   │   └── page.tsx            # Authentication UI (Login, Register, Magic Link)
│   ├── globals.css             # Tailwind v4 setup & warm light/dark CSS variables
│   ├── layout.tsx              # Root layout, metadata, viewport & zero-flash theme script
│   └── page.tsx                # Editorial landing page
├── components/
│   ├── AdminDashboard.tsx      # Interactive client dashboard for reader management
│   ├── BookReader.tsx          # Interactive book reader, TOC drawer, font & theme controls
│   └── ThemeToggle.tsx         # Light (Warm Beige) / Dark (Warm Graphite) toggle button
├── data/
│   └── book-tomo-1.ts          # Book metadata, free sample content & chapter definitions
├── supabase/
│   └── setup_and_seed_book.sql # SQL migration: tables, RLS policies & protected chapters seed
├── utils/
│   └── supabase/
│       ├── access.ts           # Admin & full-access verification logic
│       ├── admin.ts            # Service-role Supabase client for server-side admin actions
│       ├── client.ts           # Browser Supabase client
│       ├── middleware.ts       # Session refresh & route protection logic
│       └── server.ts           # Server Component / Server Action Supabase client
├── middleware.ts               # Next.js request middleware entry point
├── next.config.ts              # Next.js 16 configuration (Turbopack, cacheComponents)
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Public Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"

# Supabase Service Role Key (Required for /admin write operations, server-only)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"

# Administrator Emails (Comma-separated list of emails with access to /admin and full book)
ADMIN_EMAILS="admin@example.com"

# Optional: Additional Authorized Reader Emails via Env (Comma-separated)
ALLOWED_READERS_EMAILS="reader1@example.com,reader2@example.com"
```

> [!IMPORTANT]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit `.env.local` to version control. It is strictly used on the server inside `utils/supabase/admin.ts`.

---

## 🗄️ Database Setup (Supabase)

1. Create a new project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Copy and execute the entire contents of [`supabase/setup_and_seed_book.sql`](./supabase/setup_and_seed_book.sql). This script will:
   - Create the `public.allowed_readers` table (`email`, `has_full_access`, `granted_at`, `notes`).
   - Create the `public.book_chapters` table (`chapter_id`, `book_id`, `chapter_order`, `is_free`, `content`, `updated_at`).
   - Enable **Row Level Security (RLS)** on both tables so protected chapters can only be read by authenticated users listed in `allowed_readers` with `has_full_access = true`.
   - Seed the complete text of **Chapters II through X**, the **Epilogue**, and the **End of Volume I / Volume II Preview**.
4. In your Supabase Dashboard, navigate to **Authentication ➔ URL Configuration** and add your callback URL to **Redirect URLs**:
   - Local development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **npm**, **pnpm**, **yarn**, or **bun**
- A configured **Supabase** project

### Installation & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create `.env.local` in the project root as described in the [Environment Variables](#️-environment-variables) section.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.
   - **Landing Page:** `http://localhost:3000`
   - **Book Reader:** `http://localhost:3000/leer/tomo-1`
   - **Authentication:** `http://localhost:3000/login`
   - **Admin Panel:** `http://localhost:3000/admin` *(requires signing in with an email listed in `ADMIN_EMAILS`)*

### Production Build

```bash
npm run build
npm run start
```

---

## 📖 Book Structure (*Tomo I*)

| Section / Chapter | Title / Four Words | Pages | Access Tier |
| :--- | :--- | :---: | :---: |
| **Portada** | *Cuatro Palabras · Tomo I* | 1 | 🟢 Free Sample |
| **Dedicatoria** | *Dedication* | 2 | 🟢 Free Sample |
| **Prólogo** | *Prologue* | 4–5 | 🟢 Free Sample |
| **Introducción** | *Introduction* | 6 | 🟢 Free Sample |
| **Capítulo I** | *Resiliencia · Familia · Olvido · Perdón* | 7–8 | 🟢 Free Sample |
| **Capítulo II** | *Vida · Paz · Situaciones · Amor* | 9–11 | 🔒 Authorized Readers |
| **Capítulo III** | *Pasado · Presente · Futuro · Nada* | 12–14 | 🔒 Authorized Readers |
| **Capítulo IV** | *Trabajo · Vocación · Cansancio · Propósito* | 15–17 | 🔒 Authorized Readers |
| **Capítulo V** | *Dinero · Deseo · Miedo · Suficiencia* | 18–19 | 🔒 Authorized Readers |
| **Capítulo VI** | *Guerra · Enemigo · Silencio · Humanidad* | 20–22 | 🔒 Authorized Readers |
| **Capítulo VII** | *Emoción · Cuerpo · Silencio · Verdad* | 23–25 | 🔒 Authorized Readers |
| **Capítulo VIII** | *Ser · Vacío · Sentido · Asombro* | 26–27 | 🔒 Authorized Readers |
| **Capítulo IX** | *Enfoque · Disciplina · Constancia · Éxito* | 29–31 | 🔒 Authorized Readers |
| **Capítulo X** | *Atención · Ruido · Elección · Claridad* | 32–33 | 🔒 Authorized Readers |
| **Epílogo** | *Epilogue* | 35–36 | 🔒 Authorized Readers |
| **Fin del Tomo I** | *End of Volume I & Volume II Preview* | 37 | 🔒 Authorized Readers |

---

## ✍️ Author & Copyright

Written and developed for **Cuatro Palabras** by **Maximiliano Denis Urquiola**.  
© All rights reserved over the literary work and texts of *Cuatro Palabras*.
