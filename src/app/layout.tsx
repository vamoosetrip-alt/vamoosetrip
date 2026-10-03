import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vamoose Trip",
  description:
    "Everyone privately shares budget, home airport and vibe. We pick the destinations that work for the whole group.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <a href="/" className="brand">Vamoose Trip</a>
        </header>
        <main>{children}</main>
        <footer className="foot">
          Flight and cost figures are estimates. Check live prices before booking.
        </footer>
      </body>
    </html>
  );
}
