import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FBEA Course Planner",
  description: "HELPing you plan your courses effectively.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-800`}
      >
        {/* Header */}
        <header className="bg-purple-700 text-white p-4 shadow sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">📚 FBEA Course Planner</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-200 text-gray-200 text-center p-4 text-sm">
          <div className="mb-2">
            <a
              href="https://forms.gle/dHj5iiALFzJn6GwT7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-md bg-transparent text-gray-200 font-semibold hover:bg-transparent transition"
              style={{ fontSize: "2rem", fontFamily: "cursive" }}
            >
              Feedback
            </a>
          </div>
          © {new Date().getFullYear()} awoolfie. All rights reserved.
          <br />dedicated for steffie. love you till the very end of my codes.
          <Analytics />
        </footer>
      </body>
    </html>
  );
}