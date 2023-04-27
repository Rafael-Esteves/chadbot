import Head from "next/head";
import { useState, useEffect } from "react";
import Router from "next/router";
import Alert from "@/components/Alert";
import { API } from "@/components/apiClient";
import LandingPage from "@/components/LandingPage/LandingPage";

export default function Home() {
  const [phone, setNumber] = useState("");
  const [code, setCode] = useState();
  const [countryCode, setCountryCode] = useState("+1");
  const [showCodeInput, setShowCodeInput] = useState(false); // show the code input
  const [loading, setLoading] = useState(false); // show the loading effect

  const [api, setApi] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  }, [error]);

  const sendSms = async () => {
    setLoading(true);
    try {
      await api.sendSms(countryCode + phone);
      setShowCodeInput(true);
    } catch (err) {
      setError(err.message ?? "There was an error.");
    }
    setLoading(false);
  };

  const getToken = async () => {
    setLoading(true);
    try {
      const auth = await api.getToken(code, countryCode + phone);

      const customer = await api.getCustomer(countryCode + phone);

      localStorage.setItem("tinder_api_key", auth.api_token);
      localStorage.setItem("customer_id", customer.id);

      Router.push("/main");
    } catch (err) {
      setError(err.message ?? "There was an error.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      localStorage.getItem("tinder_api_key") &&
      localStorage.getItem("customer_id")
    )
      Router.push("/main");
    setApi(new API());
  }, []);

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
