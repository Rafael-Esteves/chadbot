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
      </Head>
      <main
        className={
          "flex flex-col items-center justify-center h-screen bg-slate-800"
        }
      >
        <HomeProvider>{props.children}</HomeProvider>
      </main>
      {/* Google ads */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=AW-11182100754`}
      ></Script>
      <Script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-11182100754', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
      {/* Analytics */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-VHSDRCCSDG`}
      ></Script>
      <Script
        id="google-analytics"
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

      {/* TikTok Ads */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

  ttq.load('CHN9U7JC77UFB57T9F60');
  ttq.page();
}(window, document, 'ttq');
      `,
        }}
      ></Script>
    </>
  );
}
