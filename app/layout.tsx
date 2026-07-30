import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delicias de Bávaro | Menú digital",
  description: "Consulta el menú y ordena desde tu mesa en Delicias de Bávaro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
