import type { Metadata } from "next";
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
  title: "Agri udyod | Smart Agriculture Suite",
  description:
    "Agri udyod provides fertilizer recommendations, plant disease detection, and crop yield prediction tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden bg-white text-emerald-950 antialiased`}
      >
        <div className="border-b border-emerald-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                AU
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-950">Agri udyod</p>
                <p className="text-xs text-emerald-700">Smart Agriculture Suite</p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-emerald-700 md:flex">
              <a className="transition hover:text-emerald-950" href="/">
                Overview
              </a>
              <a className="transition hover:text-emerald-950" href="/fertilizer">
                Fertilizer System
              </a>
              <a className="transition hover:text-emerald-950" href="/disease">
                Disease Detector
              </a>
              <a className="transition hover:text-emerald-950" href="/yield">
                Yield Prediction
              </a>
            </nav>
          </div>
        </div>
        {children}
        <footer className="border-t border-emerald-100 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-emerald-700 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Agri udyod. All rights reserved.</p>
            <p>Built for smarter, sustainable farming.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
