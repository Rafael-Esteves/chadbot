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
              `Selected Matches: ` + selectedMatches?.length ?? "loading..."
            }
            iconFirst={true}
            color="violet"
          >
            <ListIcon />
          </Button>
          <Button
            text="Manage subscription"
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
            text="Info"
            action={() => {
              setShowInfoModal((prev) => !prev);
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
            label="Auto chat"
          />
        </div>

        {!yourTurnMatches?.length && !match && !loading && (
          <div className="p-3 text-xl text-center my-5 text-white flex flex-col content-center">
            {" "}
            <p className="text-bold text-lg mb-5">
              There are no convos at your turn or new matches to open. Get to
              swipin 🔥
            </p>
            <Button
              text="refresh"
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
