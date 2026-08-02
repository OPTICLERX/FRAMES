import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frame Catalog Dashboard",
  description: "Browse custom available frame designs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}