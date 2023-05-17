import React, { useContext, useState } from "react";
import { HomeContext } from "@/context/HomeContext";
import Modal from "./Modal";
import MatchCard from "./MatchCard";
import TrialExpiredModal from "./TrialExpiredModal";
import Button from "./Button";
import LockedFeatureModal from "./LockedFeatureModal";
import ListIcon from "./svg/ListIcon";
import Switch from "./Switch";
import ReloadIcon from "./svg/ReloadIcon";
import SelectedMatchesModal from "./SelectedMatchesModal";
import InfoModal from "./InfoModal";
import InfoIcon from "./svg/InfoIcon";
import LockOpenIcon from "./svg/LockOpenIcon";
import useTranslation from "next-translate/useTranslation";
import LogoutIcon from "./svg/LogoutIcon";
import Match from "./Home/Match";

export default function Home() {
  const {
    autoChatting,
    setAutoChatting,
    selectedMatches,
    yourTurnMatches,
    restart,
    goToPortal,
    subscription,
    match,
    loading,
    setShowSelectedMatches,
    setShowInfoModal,
    matches,
  } = useContext(HomeContext);

  const { t } = useTranslation("main");

  return (
    <div className="w-full h-screen overflow-auto">
      <TrialExpiredModal />
      <LockedFeatureModal />
      <SelectedMatchesModal />
      <InfoModal />

      <div className="flex flex-col h-screen overflow-auto">
        <div className="flex flex-row justify-stretch content-stretch items-stretch h-screen">
          <div
            className={`pt-10 flex ${
              match ? "hidden lg:flex" : "flex"
            } flex-col lg:w-[20vw] w-[100vw]`}
          >
            <div className="flex flex-col px-10 gap-y-1">
              <Button
                text={t("logout")}
                action={() => {
                  localStorage.removeItem("tinder_api_key");
                  localStorage.removeItem("customer_id");
                  window.location.href = "/";
                }}
                iconFirst={true}
                color="violet"
              >
                <LogoutIcon />
              </Button>
              <Button
                text={t("manage_subscription")}
                visible={
                  typeof subscription != "undefined" &&
                  subscription?.status != "trialing"
                }
                action={() => {
                  goToPortal();
                }}
                iconFirst={true}
                color="violet"
              >
                <LockOpenIcon />
              </Button>
            </div>
            <div className="my-8 flex justify-center">
              <Switch
                id="flexSwitchCheckDefault"
                checked={autoChatting}
                action={() => {
                  if (!autoChatting) {
                    setShowSelectedMatches(true);
                  } else {
                    setAutoChatting(false);
                  }
                }}
                label={t("auto_chat") + " 🤖"}
              />
            </div>
            <div className="overflow-auto no-scrollbar h-full text-white ">
              {matches &&
                matches.map((thisMatch) => {
                  return (
                    <Match
                      selected={match?._id == thisMatch._id}
                      match={thisMatch}
                      key={thisMatch._id}
                    ></Match>
                  );
                })}
            </div>
          </div>

          {match ? (
            <div className={`${match ? "flex" : "hidden lg:flex"}`}>
              <MatchCard />
            </div>
          ) : (
            <div className="hidden lg:flex flex-col justify-center content-center text-2xl px-10  items-center w-full">
              <div className="border-slate-500 border rounded lg:max-w-4xl">
                <h2 className="p-3  my-2 text-slate-300 ">{t("info_1")}</h2>
                <h2 className="p-3  my-2 text-slate-300">{t("info_2")}</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
