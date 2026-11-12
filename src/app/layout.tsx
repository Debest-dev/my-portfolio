import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const description =
  "Graphic designer with 5+ years of experience in Photoshop-based design, photo retouching and image manipulation.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Blessed Anthony Etim | Graphic Designer & Photoshop Specialist",
  description,
  openGraph: {
    title: "Blessed Anthony Etim | Graphic Designer & Photoshop Specialist",
    description,
    type: "website",
    locale: "en_US",
    siteName: "Debest Creative",
    images: [
      {
        url: "/images/profile.webp",
        width: 1418,
        height: 1488,
        alt: "Portrait of Blessed Anthony Etim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blessed Anthony Etim | Graphic Designer & Photoshop Specialist",
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${dmSans.variable}`}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
