import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Story Website - Read and Share Stories",
  description: "Discover and share amazing stories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
