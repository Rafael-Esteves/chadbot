import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import Bubble from "./Messages/Bubble";
import Button from "./Button";
import ReloadIcon from "./svg/ReloadIcon";
import ForwardIcon from "./svg/ForwardIcon";
import SendIcon from "./svg/SendIcon";
import useTranslation from "next-translate/useTranslation";
import ArrowLeftIcon from "./svg/ArrowLeftIcon";

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
    matches,
    setMatch,
  } = useContext(HomeContext);
  const { t } = useTranslation("main");

  return (
    match &&
    matches && (
      <div className="flex flex-row-reverse text-center justify-items-center justify-center h-full">
        <div
          className={`flex-col overflow-auto no-scrollbar w-[20vw] lg:flex hidden h-full`}
        >
          <div className="grid justify-center max-h-[50vh] min-h-[25vh] w-full overflow-hidden">
            <img
              className="overflow-hidden"
              src={match.person.photos[0].processedFiles[0].url}
              alt=""
            />
          </div>

          <div className="text-xl my-5 text-white">{match.person.name}</div>

          {(interests?.length > 0 || match.person.bio) && (
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
              {true && (
                <div
                  dangerouslySetInnerHTML={{ __html: match.person.bio }}
                ></div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col lg:w-[60vw] w-[100vw]  h-full justify-end text-white">
          <div className="flex border-slate-600 border-b  flex-row items-center justify-between px-10 pt-5 h-[10vh] pb-2">
            <div
              className="cursor-pointer text-2xl "
              onClick={() => {
                setMatch();
              }}
            >
              <ArrowLeftIcon />
            </div>
            <div className="flex flex-row items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-4">
                <img
                  src={match.person.photos[0].processedFiles[0].url}
                  alt=""
                  className="object-cover"
                />
              </div>
              <div>{match.person.name}</div>
            </div>
            <div></div>
          </div>

          <div>
            {/* <p className="text-slate-400">{t("older_messages")}</p> */}
            {/* the container for the bubbles needs to have a fixed height to work properly */}
            <div className=" h-[75vh] flex text-white p-2  flex-col-reverse overflow-auto no-scrollbar">
              {messages?.map((msg) => {
                return <Bubble msg={msg} key={msg._id}></Bubble>;
              })}
            </div>
          </div>

          <div className="flex flex-row h-[15vh]">
            <textarea
              className={`${
                loading || autoChatting ? "opacity-50" : ""
              } text-xl flex p-5 w-full outline-0 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 no-scrollbar  dark:focus:border-emerald-500 bg-transparent text-white`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              rows={1}
              cols={50}
              disabled={loading || autoChatting}
              placeholder={t("textarea_placeholder")}
            />
            <div className=" bg-transparent flex flex-col justify-center lg:pr-0">
              <div className="flex flex-row lg:flex-col h-full">
                <Button
                  rounded={false}
                  text={``}
                  color="slate"
                  action={() => {
                    generateMessage();
                  }}
                  disabled={loading || autoChatting}
                >
                  <div className="flex flex-row items-center">
                    <span className="hidden lg:block uppercase whitespace-nowrap text-bold lg:mr-2">
                      {t("new_message")}
                    </span>
                    <ReloadIcon />
                  </div>
                </Button>
                <Button
                  rounded={false}
                  text={""}
                  color="emerald"
                  action={() => {
                    sendMessage(match, message);
                  }}
                  disabled={loading || autoChatting}
                >
                  <div className="flex flex-row text-bold items-center">
                    <div className="hidden lg:block whitespace-nowrap uppercase  lg:mr-2">
                      {t("send_message")}
                    </div>
                    <SendIcon />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
