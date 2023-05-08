import Head from "next/head";
import { HomeProvider } from "@/context/HomeContext";
import Script from "next/script";

export default function Base(props) {
  return (
    <>
      <Head>
        <title>Chadbot</title>
        <meta name="description" content="More dates and more time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.webp" />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-VHSDRCCSDG`}
        ></Script>
        <Script
          dangerouslySetInnerHTML={{
            __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-VHSDRCCSDG', {
          page_path: window.location.pathname,
        });
      `,
          }}
        />
      </Head>
      <main
        className={
          "flex flex-col items-center justify-center h-full bg-slate-800"
        }
      >
        <HomeProvider>{props.children}</HomeProvider>
      </main>
    </>
  );
}
