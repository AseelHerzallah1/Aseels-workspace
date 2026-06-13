import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Aseel Herzallah — Software Engineer",
  description:
    "Ask Aseel Herzallah about software engineering, AI, and real project work — RAG-grounded answers from verified profile data.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full font-sans">
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
