import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AuthGate from "@/components/AuthGate";
import MatchProvider from "@/components/MatchProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Word Games",
  description: "Luke vs Maggie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={geist.className}>
      <AuthGate>
      <MatchProvider>
        {children}
        <BottomNav />
      </MatchProvider>
      </AuthGate>
    </body>
    </html>
  );
}