import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formelio SaaS",
  description: "Formelio SaaS Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
