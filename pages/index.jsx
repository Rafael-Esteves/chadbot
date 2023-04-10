import Head from "next/head";
import { useState, useEffect } from "react";
import Router from "next/router";
import Alert from "@/components/Alert";
import { API } from "@/components/apiClient";

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
      <main
        className={
          "flex flex-col items-center md:justify-center justify-start h-screen bg-[url('/images/mobile-background.png')] bg-cover bg-bottom md:bg-center"
        }
      >
        <Alert message={error} type={"error"}></Alert>
        <div className=" bg-slate-800 text-left">
          <h3 className={"p-5 text-2xl text-white"}>
            Phone number associated with Tinder
          </h3>
          <div className={"grid md:flex p-5"}>
            <select
              className={"mt-2 p-3"}
              onChange={(e) => {
                setCountryCode(e.target.value);
              }}
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+55">🇧🇷 +55</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+47">🇳🇴 +47</option>
              <option value="+46">🇸🇪 +46</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+27">🇿🇦 +27</option>
            </select>
            <input
              className={"mt-2 bg-gray-200 p-3"}
              value={phone}
              type="text"
              placeholder="11988887777"
              onChange={(input) => {
                const onlyNums = input.target.value.replace(/[^0-9]/g, "");
                setNumber(onlyNums);
              }}
            />
            <button
              disabled={loading}
              className={`mt-2  bg-blue-500 text-white p-3 ${
                loading ? "opacity-50" : ""
              }`}
              onClick={() => sendSms()}
            >
              Send code
            </button>
          </div>

          {showCodeInput && (
            <div className={"mt-10 p-5 text-left"}>
              <h3 className="text-white text-2xl">Confirmation code</h3>
              <div className="flex">
                <input
                  className={"bg-gray-200 p-3"}
                  value={code}
                  type="text"
                  onChange={(input) => {
                    const onlyNums = input.target.value.replace(/[^0-9]/g, "");
                    setCode(onlyNums);
                  }}
                />
                <button
                  disabled={loading}
                  className={`bg-blue-500 p-3 text-white ${
                    loading ? "opacity-50" : ""
                  }`}
                  onClick={() => getToken()}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
