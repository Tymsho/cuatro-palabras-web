import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cuatro Palabras · Tomo I | Lectura Online",
  description: "Plataforma de lectura online del libro Cuatro Palabras por Maximiliano Denis Urquiola. Comprender. Aceptar. Crecer. Avanzar.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cuatro Palabras",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-stone-300">
        {children}
      </body>
    </html>
  );
}
