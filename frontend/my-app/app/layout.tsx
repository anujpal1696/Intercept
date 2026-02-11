import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google"; // ← changed fonts
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "900"], // pick weights you need
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEURO-INTERVIEW v3.0", // ← updated title to match futuristic theme
  description: "AI-powered futuristic interview simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} antialiased`}
    >
      <body
        className={`
          bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950
          text-white
          min-h-screen
          font-rajdhani           // default body font
        `}
      >
        {children}
      </body>
    </html>
  );
}