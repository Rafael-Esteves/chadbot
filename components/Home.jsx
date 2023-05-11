import React, { useContext, useState } from "react";
import { HomeContext } from "@/context/HomeContext";
import Modal from "./Modal";
import Match from "./Match";
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
  } = useContext(HomeContext);

  const { t } = useTranslation("main");

  return (
    <div className="md:w-3/4 w-full">
      <TrialExpiredModal />
      <LockedFeatureModal />
      <SelectedMatchesModal />
      <InfoModal />

      <div className="flex flex-col p-10  min-h-screen">
        <div className=" flex md:flex-row flex-col justify-between">
          <Button
            action={() => {
              setShowSelectedMatches((prev) => !prev);
            }}
            text={
              t("selected_matches") + " " + selectedMatches?.length ??
              "loading..."
            }
            iconFirst={true}
            color="violet"
          >
            <ListIcon />
          </Button>
          <Button
            text={t("manage_subscription")}
            visible={
              typeof subscription != "undefined" &&
              subscription.status != "trialing"
            }
            action={() => {
              goToPortal();
            }}
            iconFirst={true}
            color="violet"
          >
            <LockOpenIcon />
          </Button>
          <Button
            text={t("info")}
            action={() => {
              setShowInfoModal((prev) => !prev);
            }}
            iconFirst={true}
            color="violet"
          >
            <InfoIcon />
          </Button>
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
            <InfoIcon />
          </Button>
        </div>

        <div className="mt-10 mb-4 flex justify-center">
          <Switch
            id="flexSwitchCheckDefault"
            checked={autoChatting}
            action={() => {
              setAutoChatting(!autoChatting);
            }}
            label={t("auto_chat")}
          />
        </div>

        {!yourTurnMatches?.length && !match && !loading && (
          <div className="p-3 text-xl text-center my-5 text-white flex flex-col content-center">
            {" "}
            <p className="text-bold text-lg mb-5">{t("no_conversations")}</p>
            <Button
              text={t("refresh")}
              action={() => {
                restart();
              }}
              visible={!autoChatting}
              disabled={loading}
            >
              <ReloadIcon />
            </Button>
          </div>
        )}
        <div className="my-5">
          <MatchCard />
        </div>
      </div>
    </div>
  );
}
