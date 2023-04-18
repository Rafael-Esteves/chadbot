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

export default function Home() {
  const {
    autoChatting,
    setAutoChatting,
    matches,
    selectedMatches,
    setSelectedMatches,
    yourTurnMatches,
    restart,
    goToPortal,
    subscription,
    setMatch,
    loading,
  } = useContext(HomeContext);

  const [showSelectedMatches, setShowSelectedMatches] = useState(false);

  return (
    <div className="md:w-3/4 w-full">
      <TrialExpiredModal />
      <LockedFeatureModal />
      <Modal
        title="Selected Matches"
        visible={showSelectedMatches}
        setVisible={setShowSelectedMatches}
      >
        <div className="p-4 m-4 flex flex-row">
          <Button
            text="Select all"
            action={() => {
              setSelectedMatches(matches);
            }}
          />
          <Button
            text="deselect all"
            color="slate"
            action={() => {
              setSelectedMatches([]);
            }}
          />
        </div>

        <div className="overflow-auto no-scrollbar h-96 text-white ">
          {matches &&
            matches.map((match) => {
              const selected = selectedMatches?.includes(match);
              return (
                <Match
                  match={match}
                  key={match._id}
                  selected={selected}
                  setShowSelectedMatches={setShowSelectedMatches}
                ></Match>
              );
            })}
        </div>
      </Modal>

      <div className="flex flex-col p-10  min-h-screen">
        <div className=" flex md:flex-row flex-col justify-between">
          <Button
            action={() => {
              setShowSelectedMatches(!showSelectedMatches);
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
          {/* <div className="my-2 md:my-0">
            <Switch
              id="flexSwitchCheckDefault"
              checked={autoLikeRecs}
              action={() => {
                setAutoLikeRecs(!autoLikeRecs);
              }}
              label="auto like recommended"
            />
          </div> */}
        </div>
        {!yourTurnMatches?.length && (
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
        <MatchCard />
      </div>
    </div>
  );
}
