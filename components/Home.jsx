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
  } = useContext(HomeContext);

  return (
    <div className="md:w-3/4 w-full">
      <TrialExpiredModal />
      <LockedFeatureModal />
      <SelectedMatchesModal />

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
          />
        </div>

        <h2 className="p-3 text-xl my-2 text-white">
          Toggle auto chat to automatically respond to ongoing conversations and
          open new matches every 5 minutes. (Do not close this tab)
        </h2>

        <div className="my-5 flex justify-center">
          <Switch
            id="flexSwitchCheckDefault"
            checked={autoChatting}
            action={() => {
              setAutoChatting(!autoChatting);
            }}
            label="Auto chat (beta)"
          />
        </div>
        {!yourTurnMatches?.length ||
          (!match && (
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
          ))}
        <MatchCard />
      </div>
    </div>
  );
}
