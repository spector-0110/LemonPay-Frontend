import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Add font-display swap for better performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Add font-display swap for better performance
});

export const metadata = {
  title: "LemonPay - Modern Payment Solutions & Task Management",
  description: "LemonPay offers seamless payment solutions and task management tools. Experience secure transactions, real-time tracking, and efficient workflow management for businesses.",
  keywords: "LemonPay, payment solutions, task management, secure payments, business workflow, transaction management, financial management, payment processing, fintech, digital payments",
  authors: [{ name: "LemonPay" }],
  creator: "LemonPay",
  publisher: "LemonPay",
  metadataBase: new URL('https://lemonpay.vatsa.works'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "LemonPay - Modern Payment Solutions & Task Management",
    description: "Transform your business with LemonPay's secure payment solutions and intuitive task management tools.",
    type: "website",
    url: "https://lemonpay.vatsa.works",
    siteName: "LemonPay",
    locale: "en_US",
    images: [
      {
        url: "/lemon.png",
        width: 800,
        height: 600,
        alt: "LemonPay Logo - Modern Payment Solutions Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LemonPay - Modern Payment Solutions & Task Management",
    description: "Transform your business with LemonPay's secure payment solutions and intuitive task management tools.",
    creator: "@lemonpay",
    images: [{
      url: "/lemon.png",
      alt: "LemonPay Logo - Modern Payment Solutions Platform"
    }],
  },
  verification: {
    google: "your-google-site-verification", // Add your Google verification code
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://lemonpay.vatsa.works" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/lemon.png" />
        <meta name="application-name" content="LemonPay" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LemonPay" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      >
        <main>
          {children}
        </main>
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
