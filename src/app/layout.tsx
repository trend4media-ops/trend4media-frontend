import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "trend4media Abrechnungssystem",
  description: "Manager-Provisionen und Creator-Umsätze verwalten",
  keywords: ["trend4media", "Abrechnung", "Provisionen", "Manager", "Creator"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 