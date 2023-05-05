import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import Bubble from "./Messages/Bubble";
import Button from "./Button";
import ReloadIcon from "./svg/ReloadIcon";
import ForwardIcon from "./svg/ForwardIcon";
import SendIcon from "./svg/SendIcon";

export default function MatchCard() {
  const {
    message,
    match,
    setMessage,
    generateMessage,
    nextMatch,
    sendMessage,
    loading,
    messages,
    autoChatting,
    interests,
    selectedInterest,
    setSelectedInterest,
    yourTurnMatches,
  } = useContext(HomeContext);
  return (
    match &&
    yourTurnMatches && (
      <div className="flex flex-col text-center justify-items-center justify-center">
        <div className="grid justify-center">
          <img
            className="h-40 w-40 rounded-full overflow-hidden"
            src={match.person.photos[0].processedFiles[0].url}
            alt=""
          />
        </div>

        <div className="text-xl my-5 text-white">{match.person.name}</div>

        {!loading && messages?.length > 0 && (
          <div>
            <p className="text-slate-400">Scroll to read older messages</p>
            <div className="flex text-white p-2 rounded-md bg-slate-900 flex-col-reverse h-40 overflow-auto no-scrollbar">
              {messages?.map((msg) => {
                return <Bubble msg={msg} key={msg._id}></Bubble>;
              })}
            </div>
          </div>
        )}

        {!loading &&
          !messages?.length &&
          (interests?.length > 0 || match.person.bio) && (
            <div className="text-white">
              {/* <div className="text-slate-400 w-full text-left  flex items-center justify-center align-center flex-row">
                <div className="md:max-w-xl text-center">
                  <p>
                    Click one of the interests to generate a targeted opener.
                  </p>
                  <p>
                    If no interest is selected, the opener will be generated
                    based on their bio.
                  </p>
                </div>
              </div> */}
              <div className="flex flex-row flex-wrap justify-center items-center my-4">
                {interests?.map((i) => {
                  if (i == selectedInterest)
                    return (
                      <div
                        key={i}
                        onClick={(e) => {
                          // !autoChatting && setSelectedInterest(false);
                        }}
                        className="px-5 h-min py-2 mx-1 border my-1 border-emerald-300 rounded-3xl cursor-pointer"
                      >
                        {i}
                      </div>
                    );
                  else
                    return (
                      <div
                        key={i}
                        onClick={(e) => {
                          // if (!autoChatting)
                          //   setSelectedInterest(e.target.innerHTML);
                        }}
                        className="px-5 h-min py-2 border mx-1 my-1 border-slate-300 rounded-3xl"
                      >
                        {i}
                      </div>
                    );
                })}
              </div>
              {!loading && match.person.bio && !messages?.length && (
                <div
                  dangerouslySetInnerHTML={{ __html: match.person.bio }}
                ></div>
              )}
            </div>
          )}

        <textarea
          className={`${
            loading || autoChatting ? "opacity-50" : ""
          } text-xl mb-5 block p-2.5 w-full rounded-lg   outline-0 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 bg-slate-900 text-white mt-5`}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          rows={5}
          cols={50}
          disabled={loading || autoChatting}
        />
        <div className="grid md:flex md:flex-row md:justify-between">
          <Button
            text="new message"
            color="slate"
            action={() => {
              generateMessage();
            }}
            disabled={loading || autoChatting}
          >
            <ReloadIcon />
          </Button>

          <Button
            text="skip match"
            color="slate"
            action={() => {
              nextMatch();
            }}
            disabled={loading || autoChatting}
          >
            <ForwardIcon />
          </Button>

          <Button
            text="send message"
            color="emerald"
            action={() => {
              sendMessage(match, message);
            }}
            disabled={loading || autoChatting}
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    )
  );
}
