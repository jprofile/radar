import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";

import { Layout, type LayoutClass } from "@/components/Layout/Layout";
import { getJsUrl } from "@/lib/data";
import { formatTitle } from "@/lib/format";
import { assetUrl } from "@/lib/utils";

import "@/styles/_globals.css";
import "@/styles/_hljs.css";
import "@/styles/custom.css";

export type CustomPage<P = {}, IP = P> = NextPage<P, IP> & {
  layoutClass?: LayoutClass;
};

type CustomAppProps = AppProps & {
  Component: CustomPage;
};

export default function App({ Component, pageProps, router }: CustomAppProps) {
  const jsUrl = getJsUrl();
  const isHome = router.pathname === "/" || router.pathname === "/overview";

  return (
    <>
      <Head>
        <title>{formatTitle()}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={assetUrl("/favicon.ico")} />
      </Head>

      <Layout layoutClass={Component.layoutClass}>
        {!isHome && (
          <button
            onClick={() => router.push("/")}
            style={{
              position: "fixed",      
              top: "8px",             
              left: "24px",           
              zIndex: 9999,           
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label="Volver al radar"
          >
            <img
              src="/radar_icon_back.png"
              alt="Volver al radar"
              width={40}
              height={40}
              style={{ display: "block" }}
            />
          </button>
        )}

        <Component {...pageProps} />
        {jsUrl && <Script src={jsUrl} />}
      </Layout>
    </>
  );
}
