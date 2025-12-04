import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import TopProgressBar from "@/components/TopProgressBar";
import { LoaderProvider } from "@/components/LoaderProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Padhai Duniya",
  description: "Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <LoaderProvider>
            <TopProgressBar />
            {children}
            <ToastContainer position="bottom-right" />
          </LoaderProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
