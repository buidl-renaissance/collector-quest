import "@/styles/globals.css";
import type { AppProps } from "next/dist/shared/lib/router/router";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
import { Analytics } from "@vercel/analytics/react";
import { NextSeo } from "next-seo";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/styles/theme";
import { Global, css } from "@emotion/react";
import Head from "next/head";
import { CharacterProvider } from "@/context/CharacterContext";
import { CacheProvider } from "@/context/CacheContext";

export default function App({ Component, pageProps }: AppProps) {
  const metadata = pageProps.metadata || {};
  
  return (
    <>
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#1a1a2e" />
      </Head>
      <ThemeProvider theme={theme}>
        <Global
          styles={css`
            :root {
              color-scheme: dark;
            }
            
            html {
              background-color: #1a1a2e;
            }

            body {
              background-color: #1a1a2e;
              color: #c7bfd4;
              margin: 0;
              padding: 0;
              min-height: 100vh;
            }

            /* Prevent white flash during page load */
            #__next {
              background-color: #1a1a2e;
              min-height: 100vh;
            }

            /* Force dark scrollbars */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #1a1a2e;
            }

            ::-webkit-scrollbar-thumb {
              background: #3a3347;
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: #4a4357;
            }
          `}
        />
        <CacheProvider>
          <CharacterProvider>
            <NextSeo
              title={metadata.title || "COLLECTOR QUEST | A Turn-Based AI Dungeon Game"}
              description={metadata.description || "Embark on infinite adventures in this turn-based AI storytelling game. Create a hero, forge unique quests, and build your collection of legendary tales."}
              openGraph={{
                title: metadata.title,
                description: metadata.description,
                images: metadata.image ? [{ url: metadata.image }] : undefined,
                url: metadata.url,
              }}
            />
            <WalletProvider autoConnect>
              <AuthProvider>
                <Component {...pageProps} />
              </AuthProvider>
            </WalletProvider>
            <Analytics />
          </CharacterProvider>
        </CacheProvider>
      </ThemeProvider>
    </>
  );
}
