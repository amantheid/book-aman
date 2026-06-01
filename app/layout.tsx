import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 21 Days That Built a Creative Constructor",
  description: "Pre-order the debut book by Aman Muhammed — a real story of growth, discipline, creativity, and self-discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#FFFFE3' }}>
        {children}
      </body>
    </html>
  );
}
