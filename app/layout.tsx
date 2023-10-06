import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { dark } from "@clerk/themes";
import Providers from "@/components/package/Providers";
import Header from "@/components/page/Header";
import {ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Discussions app",
  description: "discussions app created by chill31. View or discuss about any topic you want.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.className} flex flex-col items-start justify-start gap-0`}>
          <Providers>
            <Header></Header>
            {children}
            <Toaster position="top-center" />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
