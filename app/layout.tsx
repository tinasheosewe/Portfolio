import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import AiOrb from "@/components/AiOrb";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tinashe Osewe — Software Engineer",
  description: "Software engineer building AI-powered products end to end.",
  openGraph: {
    title: "Tinashe Osewe — Software Engineer",
    description: "Software engineer. AI products. Shipped.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} grain`}>
        <Preloader />
        <Cursor />
        <SmoothScroll />
        <Nav />
        <AiOrb />
        {children}
      </body>
    </html>
  );
}
