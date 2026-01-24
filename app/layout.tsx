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
});

const bebas = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Praxis AI",
  description: "Externalize memory. Preserve clarity.",
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
