import Head from "next/head";
import LandingPage from "@/components/LandingPage/LandingPage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chadbot</title>
        <meta name="description" content="More dates and more time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.webp" />
      </Head>
      <main>
        <LandingPage />
      </main>
    </>
  );
}
