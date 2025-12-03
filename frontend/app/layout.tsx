import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // <--- Import Toaster
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus AI",
  description: "Autonomous Research Architect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors theme="dark" /> {/* <--- Add this line */}
      </body>
    </html>
  );
}