import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import CommandPalette from "@/components/CommandPalette";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tinasheosewe.com"),
  title: "Tinashe Osewe — Software Engineer",
  description: "Software engineer building AI-powered products, enterprise platforms, and native mobile apps end to end. Goldman Sachs. New York.",
  keywords: ["software engineer", "AI engineer", "full stack developer", "Goldman Sachs", "New York", "FastAPI", "Next.js", "LangChain", "Swift", "TypeScript", "portfolio"],
  authors: [{ name: "Tinashe Osewe", url: "https://tinasheosewe.com" }],
  creator: "Tinashe Osewe",
  openGraph: {
    title: "Tinashe Osewe — Software Engineer",
    description: "Software engineer building AI-powered products end to end.",
    url: "https://tinasheosewe.com",
    siteName: "Tinashe Osewe",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinashe Osewe — Software Engineer",
    description: "Software engineer building AI-powered products end to end.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} grain`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Tinashe Osewe",
            url: "https://tinasheosewe.com",
            jobTitle: "Software Engineer",
            worksFor: { "@type": "Organization", name: "Goldman Sachs" },
            knowsAbout: ["Artificial Intelligence", "Full Stack Development", "LangChain", "FastAPI", "Next.js", "Swift", "TypeScript", "Python"],
            alumniOf: { "@type": "CollegeOrUniversity", name: "Rensselaer Polytechnic Institute" },
            sameAs: [
              "https://www.linkedin.com/in/tinasheosewe/",
              "https://github.com/tinasheosewe"
            ]
          }) }}
        />
        <Preloader />
        <Cursor />
        <SmoothScroll />
        <Nav />
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
