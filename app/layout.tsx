import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume ATS Optimizer - Optimize Your Resume for ATS in Seconds",
  description: "AI-powered resume optimization tool that helps you pass ATS systems and land your dream job. Free, fast, and effective.",
  keywords: ["resume optimizer", "ATS", "resume builder", "job application", "resume checker"],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "Resume ATS Optimizer",
    description: "Optimize your resume for ATS systems in seconds",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

