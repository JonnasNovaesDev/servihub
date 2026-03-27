import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "ServiHub — Marketplace de Serviços",
    template: "%s | ServiHub",
  },
  description:
    "Encontre prestadores de serviço verificados na sua região. Limpeza, reformas, tecnologia, beleza e muito mais.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
