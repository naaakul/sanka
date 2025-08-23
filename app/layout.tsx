import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Jost } from "next/font/google";
import { ThemeProvider } from "../components/ui/theme-provider";
import Script from "next/script";

const jost = Jost({
  subsets: ["latin"],
  weight: "800", 
  style: "italic",
  variable: "--font-jost",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sañka — Next.js Code, AI Agents & Animated Videos",
  description:
    "Sañka is your all-in-one AI studio to generate React/Next.js components, build AI agents, and create animated videos instantly.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Sañka —  Next.js Code, AI Agents & Animated Videos",
    description:
      "Generate React/Next.js components, build AI agents, and create animated videos with Sañka.",
    url: "https://sanka.nakul.space",
    siteName: "Sañka",
    images: [
      {
        url: "https://sanka.nakul.space/logo-w.svg",
        width: 1200,
        height: 630,
        alt: "Sañka Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sañka — AI Agents, React Code & Animated Videos",
    description:
      "Generate React/Next.js components, AI agents, and animated videos instantly with Sañka.",
    images: ["https://sanka.nakul.space/logo-w.svg"],
    creator: "@heynakul",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jost.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
          <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}
