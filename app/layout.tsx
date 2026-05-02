import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Curation Feed",
  description: "A public inspiration feed curated from the open web."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
