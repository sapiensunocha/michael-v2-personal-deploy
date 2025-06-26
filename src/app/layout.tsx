// src/app/layout.tsx
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Keep commented as it was
import React from "react";
import "./globals.css";
import ProviderWrapper from "./ProviderWrapper";

console.log("--- Server: layout.tsx (top-level execution) ---");

export const metadata: Metadata = {
  // Removed 'title' property to allow the browser to default to the URL/hostname,
  // making the tab title as minimal as possible.
  description: "Pioneering disaster intelligence with cutting-edge map technology.", // Kept description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("--- Server: RootLayout component function entered ---");

  return (
    <html lang="en">
      {/* Removed the explicit <head> tag. Next.js App Router automatically
          manages the <head> based on the 'metadata' export. */}
      <body>
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
        {/* Removed the <p>Minimal Layout Rendered</p> as it was for debugging */}
      </body>
    </html>
  );
}

console.log("--- Server: layout.tsx (after component export) ---");