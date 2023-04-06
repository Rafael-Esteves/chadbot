import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import Bubble from "./Messages/Bubble";

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
  return match && yourTurnMatches?.length ? (
    <div className="flex flex-col text-center justify-items-center justify-center">
      <div className="grid justify-center">
        <img
          className="h-40 w-40 rounded-full overflow-hidden"
          src={match.person.photos[0].processedFiles[0].url}
          alt=""
        />
      </div>

      <div className="text-xl my-5 text-white">{match.person.name}</div>
      <div
        className={`flex overflow-auto no-scrollbar text-white h-40 mb-5  flex-col-reverse`}
      >
        {!loading &&
          messages?.map((msg) => {
            return <Bubble msg={msg} key={msg._id}></Bubble>;
          })}
        {!loading && !messages?.length && (
          <div className="flex flex-row justify-center items-center align-middle h-full">
            {interests?.map((i) => {
              if (i == selectedInterest)
                return (
                  <div
                    id={i}
                    onClick={(e) => {
                      if (!autoChatting)
                        setSelectedInterest(e.target.innerHTML);
                    }}
                    className="px-5 py-2 mx-3 border border-emerald-300 rounded-3xl cursor-pointer"
                  >
                    {i}
                  </div>
                );
              else
                return (
                  <div
                    id={i}
                    onClick={(e) => {
                      if (!autoChatting)
                        setSelectedInterest(e.target.innerHTML);
                    }}
                    className="px-5 py-2 mx-3 border border-slate-300 rounded-3xl cursor-pointer"
                  >
                    {i}
                  </div>
                );
            })}
          </div>
        )}
      </div>
      <textarea
        className={`${
          loading || autoChatting ? "opacity-50" : ""
        } text-xl mb-5 block p-2.5 w-full rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 bg-slate-700 text-white`}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        rows={5}
        cols={50}
        disabled={loading || autoChatting}
      />
      <div className="grid md:flex md:flex-row md:justify-between">
        <button
          className={` ${
            loading || autoChatting ? "opacity-50" : ""
          } bg-slate-500 text-white active:bg-slate-600 font-bold uppercase text-sm pr-6 pl-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150`}
          onClick={() => {
            generateMessage();
          }}
          disabled={loading || autoChatting}
        >
          Generate new
        </button>
        <button
          className={` ${
            loading || autoChatting ? "opacity-50" : ""
          } bg-rose-400 text-white active:bg-rose-600 font-bold uppercase text-sm pr-6 pl-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150`}
          onClick={() => {
            nextMatch();
          }}
          disabled={loading || autoChatting}
        >
          Skip for now
        </button>
        <button
          className={` ${
            loading || autoChatting ? "opacity-50" : ""
          } bg-emerald-400 text-white active:bg-emerald-600 font-bold uppercase text-sm pr-6 pl-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150`}
          onClick={() => {
            sendMessage(match, message);
          }}
          disabled={loading || autoChatting}
        >
          Send message
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}
