import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

const SITE_URL = "https://incatrailfoods.com";
const SITE_DESCRIPTION =
  "Original Nacional cacao from Zamora Chinchipe — FMAD technology, 7-hour tree-to-bean cycle, zero fermentation, full anthocyanin preservation.";
const SOCIAL_DESCRIPTION =
  "We stop time. Authentic Nacional from the Amazon highlands of Ecuador — unfermented, cryo-fixed, fully traceable.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Inca Trail Foods | Purple Gold Cacao",
    template: "%s | The Inca Trail Foods",
  },
  description: SITE_DESCRIPTION,
  applicationName: "The Inca Trail Foods",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Inca Trail Foods | Purple Gold",
    description: SOCIAL_DESCRIPTION,
    url: SITE_URL,
    siteName: "The Inca Trail Foods",
    locale: "es_EC",
    alternateLocale: ["en_US", "ru_RU"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Inca Trail Foods | Purple Gold",
    description: SOCIAL_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${cormorant.variable}`}>
      <body
        className="antialiased"
        style={{
          margin: 0,
          backgroundColor: "#030205",
          color: "#e0e0e0",
          minHeight: "100vh",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
