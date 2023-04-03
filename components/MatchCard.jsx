import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import Bubble from "./Messages/Bubble";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  } = useContext(HomeContext);
  return match ? (
    <div className="flex flex-col text-center justify-items-center justify-center">
      <div className="grid justify-center">
        <img
          className="h-40 w-40 rounded-full overflow-hidden"
          src={match.person.photos[0].processedFiles[0].url}
          alt=""
        />
      </div>

      <div className="text-xl my-5 text-white">{match.person.name}</div>

      {message ? (
        <>
          <div
            className={`${
              messages?.length ? "flex" : "hidden"
            } overflow-auto no-scrollbar text-white h-60 mb-5  flex-col-reverse`}
          >
            {!loading &&
              messages?.map((msg) => {
                console.log(msg);
                return <Bubble msg={msg} key={msg._id}></Bubble>;
              })}
          </div>
          <textarea
            className="text-xl block p-2.5 w-full rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 bg-slate-700 text-white"
            value={message}
            onChange={() => {
              setMessage(message);
            }}
            rows={3}
            cols={50}
            disabled={loading || autoChatting}
          />
        </>
      ) : (
        <Skeleton count={3} />
      )}
      <div className="grid md:flex md:flex-row md:justify-between mt-5">
        <button
          className={` ${
            loading ? "opacity-50" : ""
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
            loading ? "opacity-50" : ""
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
            loading ? "opacity-50" : ""
          } bg-emerald-400 text-white active:bg-emerald-600 font-bold uppercase text-sm pr-6 pl-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mb-1 ease-linear transition-all duration-150`}
          onClick={() => {
            sendMessage();
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
