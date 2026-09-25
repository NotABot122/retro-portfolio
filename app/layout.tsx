import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Portfolio — Windows 95",
  description: "Personal portfolio built with a retro Windows 95 aesthetic",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="scanlines" suppressHydrationWarning>
        <div className="monitor-frame" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
