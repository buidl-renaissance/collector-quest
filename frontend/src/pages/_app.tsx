import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </>
  );
}
