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
        <div className="p-4 m-4">
          <Button
            text="Select all"
            action={() => {
              setSelectedMatches(matches);
            }}
          />
        </div>
        <div className="overflow-auto no-scrollbar h-96 text-white ">
          {matches &&
            matches.map((match) => {
              const selected = selectedMatches?.includes(match);
              return (
                <Match
                  setSelectedMatches={setSelectedMatches}
                  selectedMatches={selectedMatches}
                  key={match._id}
                  match={match}
                  selected={selected}
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
            label="Auto chat"
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
          <div className="p-3 text-xl text-center my-5 text-white">
            {" "}
            <p className="text-bold text-lg mb-5">
              There are no convos at your turn or new matches to open. Get to
              swipin 🔥
            </p>
            <button
              className={`bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
              onClick={() => {
                restart();
              }}
            >
              Refresh
            </button>
          </div>
        )}
        <MatchCard />
      </div>
    </div>
  );
}
