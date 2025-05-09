import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";
import "@mysten/dapp-kit/dist/index.css"; // <-- Import dApp Kit CSS
import { Providers } from "./providers";   // <-- Import Providers
import { Pixelify_Sans } from "next/font/google";
import { Courier_Prime } from "next/font/google";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({ 
  subsets: ["latin"],  
  weight: ["400"],
  variable: "--font-press-start-2p", })
  
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Specify the weights you need
  display: 'swap',
  variable: '--font-pixelify',
})

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify the weights you need
  display: 'swap',
  variable: '--font-courier-prime',
})

export const metadata: Metadata = {
  title: "Sui Overflow",
  description: "Degen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={oswald.variable}>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pixelify.variable} ${courierPrime.variable} ${pressStart2P.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
