import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { Analytics } from "@vercel/analytics/react";
import { NextSeo } from "next-seo";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/context/ThemeContext";
import { CharacterProvider } from "@/context/CharacterContext";

export default function App({ Component, pageProps }: AppProps) {
  const metadata = pageProps.metadata || {};
  
  return (
    <ThemeProvider>
      <CharacterProvider>
        <NextSeo
          title={metadata.title || "Lord Smearington"}
          description={metadata.description || "Interdimensional Art Prophet"}
          openGraph={{
            title: metadata.title,
            description: metadata.description,
            images: metadata.image ? [{ url: metadata.image }] : undefined,
            url: metadata.url,
          }}
        />
        <WalletProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </WalletProvider>
        <Analytics />
      </CharacterProvider>
    </ThemeProvider>
  );
}
