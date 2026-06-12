import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axion AI",
  description: "Intelligence, Amplified",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#1F1F1E] text-[#F0EFED] antialiased">
        {children}
      </body>
    </html>
  );
}
