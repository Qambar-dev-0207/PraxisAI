import type { Metadata } from "next";
import { Inter, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";
import SmoothScroll from "./components/SmoothScroll";
import { TransitionProvider } from "./components/TransitionProvider";
import MotionConfig from "./components/MotionConfig";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

const bebas = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
  fallback: ['monospace'],
});

export const metadata: Metadata = {
  title: "Praxis AI",
  description: "Externalize memory. Preserve clarity.",
  metadataBase: new URL('https://praxis-ai.vercel.app'),
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebas.variable} ${mono.variable} antialiased bg-brand-white text-brand-black cursor-none selection:bg-brand-black selection:text-brand-white`}
      >
        <MotionConfig>
          <TransitionProvider>
              <CustomCursor />
              <SmoothScroll>{children}</SmoothScroll>
          </TransitionProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
