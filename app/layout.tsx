import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { abcRepro, abcReproMono } from './fonts/fonts';
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simli Agent",
  description: "create-simli-agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${abcReproMono.variable} ${abcRepro.variable} bg-green-900`}>
      <body className={`${inter.className} bg-green-900 text-white`}>
        <div className="min-h-screen w-full bg-green-900">
          {children}
        </div>
      </body>
    </html>
  );
}
