import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { NextSeo } from "next-seo";

export default function App({ Component, pageProps }: AppProps) {
  const metadata = pageProps.metadata || {};
  
  return (
    <>
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
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
      <Analytics />
    </>
  );
}
