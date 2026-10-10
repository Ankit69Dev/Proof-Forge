
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProofForge Lite | AI Code Verification",
  description:
    "A Gemma-powered coding prototype exploring evidence-driven code evaluation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
