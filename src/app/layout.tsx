import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { site, absoluteUrl, asset } from "@/lib/site";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { ThemeScript } from "@/components/ThemeScript/ThemeScript";
import styles from "./layout.module.css";

const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: { default: site.title, template: `%s · ${site.title}` },
  description: site.description,
  alternates: { types: { "application/rss+xml": absoluteUrl("/rss.xml") } },
  icons: { icon: asset("/favicon.svg") },
  openGraph: {
    type: "website",
    siteName: site.title,
    images: [absoluteUrl("/og-default.svg")],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={pixel.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={styles.body}>
        <a className={styles.skipLink} href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" className={styles.main}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
