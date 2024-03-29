import React from "react";
import { useState, useEffect } from "react";
import Router from "next/router";
import Alert from "@/components/Alert";
import { API } from "@/components/apiClient";
import useTranslation from "next-translate/useTranslation";

const LandingPage = () => {
  const [phone, setNumber] = useState("");
  const [code, setCode] = useState();
  const [countryCode, setCountryCode] = useState("+1");
  const [showCodeInput, setShowCodeInput] = useState(false); // show the code input
  const [token, setToken] = useState(""); // show the loading effect
  const [loading, setLoading] = useState(false); // show the loading effect

  const [api, setApi] = useState();
  const [error, setError] = useState();

  const { t } = useTranslation("common");

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
      console.log(err);
      setError(err.message ?? "There was an error.");
    }
    setLoading(false);
  };

  const login = () => {
      localStorage.setItem("tinder_api_key", token);
      localStorage.setItem("customer_id", 1);

      Router.push("/main");
  }

  const getToken = async () => {
    setLoading(true);
    try {
      const auth = await api.getToken(code, countryCode + phone);

      const auth_api = new API(auth.api_token);

      const user = await auth_api.getSelf();

      const customer = await api.getCustomer(countryCode + phone, user);

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
    <div className="bg-slate-800 min-h-screen flex flex-col-reverse lg:flex-row">
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl text-white font-bold mb-10">{t("welcome")}</h1>
        <p className="text-white text-left mt-10 lg:max-w-lg text-2xl">
          {t("description1")}
        </p>
        <p className="text-white text-right mt-10 lg:max-w-lg text-2xl">
          {t("description2")}
        </p>
        <p className="text-white text-left mt-10 lg:max-w-lg text-2xl">
          {t("description3")}
        </p>
      </div>
      <div className="lg:w-1/2 text-white flex flex-col justify-center items-center p-10 bg-gradient-to-br from-orange-500 to-rose-500">
        <h2 className="text-3xl font-bold mb-5">{t("login_with")} Tinder</h2>
        <div className="mb-5 p-8 h-28 w-28 shadow-inner rounded-full overflow-hidden bg-white flex items-center justify-content-center">
          <img src="/images/tinder-logo.png" alt="tinder logo" />
        </div>
        <Alert message={error} type={"error"}></Alert>
        <div className=" bg-slate-800 text-left rounded-lg">
          <h3 className={"pt-5 px-5 text-2xl text-white"}>
            {t("login_with")} Tinder API Token
          </h3>


            <div className={" p-5 text-left"}>
              <h3 className="text-white text-2xl mb-5">
                Tinder API Token
              </h3>
              <div className="flex items-stretch w-full">
                <input
                  className={"bg-slate-900 p-3 w-full outline-0"}
                  value={token}
                  type="text"
                  onChange={(input) => {
                    setToken(input.target.value);
                  }}
                />
                <button
                  disabled={loading}
                  className={`bg-emerald-500 p-3 text-white ${
                    loading ? "opacity-50" : ""
                  }`}
                  onClick={() => login()}
                >
                  {t("login")}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
