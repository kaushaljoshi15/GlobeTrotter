import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GlobeTrotter — Travel, Composed. Bespoke Multi-City Travel Planner",
  description: "GlobeTrotter is an intelligent boutique travel design operating system. Compose multi-city journeys, model scenic stops, and balance daily budgets across the world's most breathtaking landscapes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#0c0d10] text-[#f4f2ee] selection:bg-[#c99a6b] selection:text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
