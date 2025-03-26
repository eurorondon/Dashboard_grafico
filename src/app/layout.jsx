// RootLayout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "../wraper/QueryProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grafico Caracas",
  description: "Excelentes precios",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider
          signInFallbackRedirectUrl="/trading"
          signUpFallbackRedirectUrl="/trading"
        >
          <div className="h-full">
            <main className="h-full">
              {/* Aquí el QueryProvider envuelve el contenido solo en el cliente */}
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
