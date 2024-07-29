import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { ToastContainer } from "react-toastify";
import Header from "@/components/header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evm Scan",
  description: "Best evm address & tx scanner in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NetworkProvider>
          <main className="flex min-h-screen flex-col items-center">
            <ToastContainer />
            <Header />
            <div className="py-8 px-4 w-full">{children}</div>
          </main>
        </NetworkProvider>
      </body>
    </html>
  );
}
