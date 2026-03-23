import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mooh Notes",
  description: "A bilingual blog and study notes site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
