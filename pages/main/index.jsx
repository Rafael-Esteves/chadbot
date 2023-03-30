import Head from "next/head";
import { useState, useEffect } from "react";
import Router from "next/router";

export default function Home() {
  const [loading, setLoading] = useState(false);

  //random comment
  const chat = async () => {
    setLoading(true);
    const resp = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        token: localStorage.getItem("tinder_api_key"),
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    setLoading(false);

    const response = await resp.json();

    if (response.error) {
      if (response.error.status == 401) Router.push("/");
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("tinder_api_key")) Router.push("/");
  });
  return (
    <>
      <Head>
        <title>ChadBot</title>
        <meta name="description" content="More dates and more time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.webp" />
      </Head>
      <main
        className={
          "flex flex-col items-center justify-center h-screen bg-[url('/images/multi-chad.jpeg')]"
        }
      >
        <div className="p-5 bg-slate-800 text-center text-white w-100">
          <h2 className="p-3 text-xl my-5">
            Clicando no botão o bot vai começar uma conversa com todos os novos
            matches e vai responder todos os matches que estão na sua vez de
            responder. Seus cornos.
          </h2>
          <button
            className={`bg-blue-500 p-3 text-white w-100 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
            onClick={() => chat()}
          >
            {loading ? "Enviando mensagens..." : "Enviar mensagens"}
          </button>
        </div>
      </main>
    </>
  );
}
