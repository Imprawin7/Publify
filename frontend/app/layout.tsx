import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { getAbout } from "@/lib/api";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Publify — Content, beautifully managed.",
  description:
    "Publify is a modern content management and publishing platform for creating, organizing, managing, and publishing digital content.",
  applicationName: "Publify",
  keywords: [
    "Publify",
    "content management",
    "CMS",
    "content publishing",
    "digital publishing",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const about = await getAbout();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plex.variable}`}
    >
      <body className="font-body antialiased">
        <PublicShell email={about?.email}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}