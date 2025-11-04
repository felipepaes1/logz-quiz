// src/app/layout.tsx
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico Log Z",
  description: "Obtenha um diagnóstico completo sobre sua operação",
  icons: {
    icon: "/z.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
