import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Acco-Finder",
  description: "Your Gateway to Indian Student Life in the USA",
  openGraph: {
    title: "Acco-Finder",
    description: "Find housing, network, and thrive as a student in the USA.",
    url: "https://acco-finder.com",
    images: [
      {
        url: "https://res.cloudinary.com/naacloud/image/upload/v1736403251/giuqve0grdymrwh80ftm.png",
        width: 800,
        height: 600,
        alt: "Acco-Finder Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acco-Finder",
    description: "Your Gateway to Indian Student Life in the USA.",
    images: [
      "https://res.cloudinary.com/naacloud/image/upload/v1736403251/giuqve0grdymrwh80ftm.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://acco-finder.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Acco-Finder",
              description:
                "The all-in-one platform for Indian students in the USA.",
              url: "https://acco-finder.com",
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
