// src/app/layout.tsx
import "../globals.css";

export const metadata = {
  title: "Log Z Quiz",
  description: "Obtenha um diagnóstico completo sobre sua operação",
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
