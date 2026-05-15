import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "The Inca Trail Foods | Purple Gold Cacao",
  description:
    "Original Nacional cacao from Zamora Chinchipe — cryo-fixed biochemistry, zero fermentation, full anthocyanin preservation.",
  metadataBase: new URL("https://incatrailfoods.com"),
  openGraph: {
    title: "The Inca Trail Foods | Purple Gold",
    description:
      "We stop time. Authentic Nacional from the Amazon highlands of Ecuador.",
    url: "https://incatrailfoods.com",
    siteName: "The Inca Trail Foods",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
