import Head from "next/head";
import { HomeProvider } from "@/context/HomeContext";

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
          "flex flex-col items-center justify-center h-full bg-[url('/images/multi-chad.jpeg')]"
        }
      >
        <HomeProvider>{props.children}</HomeProvider>
      </main>
    </>
  );
}
