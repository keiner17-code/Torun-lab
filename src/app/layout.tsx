import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Torun Monitor",
  description: "Monitoreo y observabilidad de agentes IA — Torun Lab",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
