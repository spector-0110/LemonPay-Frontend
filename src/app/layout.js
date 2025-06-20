import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LemonPay - Your Success is Our Focus",
  description: "Your gateway to seamless transactions and easy payments",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      >
        {children}
        <Toaster 
          position="top-right"
          richColors
          expand={true}
          duration={4000}
        />
      </body>
    </html>
  );
}
