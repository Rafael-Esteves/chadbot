import React, { useContext, useState } from "react";
import { HomeContext } from "@/context/HomeContext";
import Modal from "./Modal";
import Match from "./Match";

export default function Home() {
  const {
    loading,
    autoChatting,
    setAutoChatting,
    setLoading,
    matches,
    setMatches,
    selectedMatches,
    setSelectedMatches,
    style,
    setStyle,
    opener,
    setOpener,
    chat,
  } = useContext(HomeContext);

  const [showSettings, setShowSettings] = useState(false);
  const [showSelectedMatches, setShowSelectedMatches] = useState(false);

  return (
    <>
      <Modal
        title="Selected Matches"
        visible={showSelectedMatches}
        setVisible={setShowSelectedMatches}
      >
        <div className="overflow-auto no-scrollbar h-96 text-white ">
          {matches &&
            matches.map((match) => {
              const selected = selectedMatches.includes(match._id);
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
      <Modal
        title="Settings"
        visible={showSettings}
        setVisible={setShowSettings}
        onSave={() => {}}
      >
        <div className="justify-left text-left">
          <h2 className="text-2xl text-white"> Settings:</h2>
          <label className="block text-white mb-2" htmlFor="style">
            Configure the GPT prompt to your liking.
          </label>
          <textarea
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            id="style"
            value={style}
            rows={10}
            cols={50}
            onChange={(e) => {
              if (
                typeof window !== "undefined" &&
                typeof e.target.value !== "undefined"
              ) {
                setStyle(e.target.value);
              }
            }}
          />
          <label className="block text-white mb-2" htmlFor="style">
            Configure the text fragment that will be added to the prompt when it
            is the first message (opener).
          </label>
          <textarea
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
            id="style"
            value={opener}
            rows={10}
            cols={50}
            onChange={(e) => {
              if (
                typeof window !== "undefined" &&
                typeof e.target.value !== "undefined"
              ) {
                setOpener(e.target.value);
              }
            }}
          />
        </div>
      </Modal>
      <div className="flex flex-col bg-slate-800 p-10">
        <div className="flex md:flex-row flex-col justify-between">
          <button
            className={`bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm pr-6 pl-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
            onClick={() => {
              setShowSelectedMatches(!showSelectedMatches);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 inline-block hidden mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Selected Matches: {selectedMatches?.length ?? "loading..."}
          </button>
          <button
            className={`bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm pr-6 pl-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
            onClick={() => {
              setShowSettings(!showSettings);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings{" "}
          </button>
        </div>

        <h2 className="p-3 text-xl mt-5 text-white">
          Click chat now to generate a custom message to each of the selected
          matches. Do not worry, you can review them before they are sent.
        </h2>
        <button
          className={`bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
          onClick={async () => await chat()}
        >
          {loading ? "AutoChatting..." : "Chat now"}
        </button>

        <h2 className="p-3 text-xl mt-5 text-white">
          Or toggle auto chat to automatically respond every 5 minutes. (Do not
          close this tab)
        </h2>
        <div className="text-center">
          <label
            className="inline-block pr-[0.15rem] hover:cursor-pointer text-white text-xl text-bold uppercase"
            htmlFor="flexSwitchCheckDefault"
          >
            Auto chat
          </label>
          <input
            className="mt-[0.3rem] ml-5 scale-150 mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-emerald-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-emerald-500 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-emerald-500 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-emerald-500 dark:checked:after:bg-emerald-500"
            type="checkbox"
            role="switch"
            checked={autoChatting}
            id="flexSwitchCheckDefault"
            onChange={() => {
              setAutoChatting(!autoChatting);
            }}
          />
        </div>
      </div>
    </>
  );
}
