import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "LandsbankIndia | Land Intelligence Platform", description: "Discover, evaluate and connect around land across India with smarter land intelligence." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
