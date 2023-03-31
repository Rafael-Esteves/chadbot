import Head from "next/head";
import { useState, useEffect } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [autoChatting, setAutoChatting] = useState(false);
  const [matches, setMatches] = useState();
  const [style, setStyle] = useState();
  const [opener, setOpener] = useState();
  useEffect(() => {
    const tokenCookie = localStorage.getItem("tinder_api_key");
    if (!tokenCookie) Router.push("/");
  });

  useEffect(() => {
    const storedStyle = localStorage.getItem("style");
    const storedOpener = localStorage.getItem("opener");

    if (storedStyle) {
      console.log("storedStyle", storedStyle);
      setStyle(storedStyle);
    } else {
      setStyle(
        `Current time: $time\nCurrent date: $date\n\nYou are $yourname, a $yourgender.\nYou are talking to a Tinder match.\nYour messages must be short, flirty and informal. You should never explain or justify yourself. Be concise, don't ramble. Use some slang. Information about the match: Name: $matchname,\nInterests: $matchinterests,\nDistance between you: $distancemi miles`
      );
    }

    if (storedOpener) {
      console.log("storedStyle", storedOpener);
      setStyle(storedOpener);
    } else {
      setOpener(
        `Make a custom opening line that includes the match nameand a question related to their interests. This question must be the message's main focus. The message should not contain anything other than the question. `
      );
    }

    if (!matches) {
      console.log("matches", matches);

      const api = new API();
      const uncessaryAsync = async () => {
        const resp = await api.getMatches();
        console.log(resp);
        setMatches(resp);
      };
      uncessaryAsync();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof style !== "undefined") {
      localStorage.setItem("style", style);
    }
    console.log(localStorage.getItem("style"));
  }, [style]);

  useEffect(() => {
    let intervalId;
    console.log("autoChatting changed");

    if (autoChatting) {
      console.log("autoChatting is true");

      intervalId = setInterval(() => {
        chat();
      }, 50000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [autoChatting]);

  const chat = async () => {
    setLoading(true);
    console.log("chat function called");
    try {
      //start api
      const api = new API();

      //get info about the user
      const self = await api.getSelf();
      const user = self.user;

      //get matches
      const matches = await api.getMatches();
      console.log(matches);

      for (let match of matches) {
        //check if last message was sent by match
        if (
          match.messages.length &&
          match.messages[0].from != match.person._id
        ) {
          console.log("Not your turn");
          continue;
        }

        const rawMessages = await api.getMessages(match._id);

        const phoneRegex =
          /(\+55\s*\(?([1-9]{2})\)?\s*)?9\s*([6789]\d{3}[-\s]?\d{4})/g;

        //check if phone number or insta was sent

        if (false) {
          let gotcha = null;
          for (let msg of rawMessages) {
            if (
              msg.message.match(phoneRegex) ||
              msg.message.includes("instagram") ||
              msg.message.includes("@")
            ) {
              gotcha = msg.message;
            }
          }
          if (gotcha) {
            console.log("Got the number right here boyy", gotcha);
            continue;
          }
        }

        //if you got here, it means it will generate a message to send

        const profile = await api.getProfile(match.person._id);
        const name = profile.name.split(" ")[0];
        console.log("Name: ", name);

        const interests = profile.user_interests?.selected_interests.map(
          (interest) => interest.name
        );

        const interestsString = () => {
          let string = "";
          if (interests) {
            string = ``;
            interests.forEach((int) => {
              string = string + int + ", ";
            });
          }
          return string;
        };

        const moreInfo = profile.selected_descriptors?.map((descriptor) => {
          return `${descriptor.name}: ${descriptor.choice_selections[0].name}.`;
        });

        const distance_km = parseInt(profile.distance_mi / 0.621371);

        const now = new Date();
        const filteredStyle =
          style
            .replace("$yourname", user.name)
            .replace("$yourgender", user.gender == 1 ? "woman" : "man")
            .replace("$distancemi", profile.distance_mi)
            .replace("$distancekm", distance_km)
            .replace("$matchname", name)
            .replace("$matchinterests", interestsString())
            .replace("$date", now.toLocaleDateString())

            .replace("$time", now.toLocaleTimeString()) + moreInfo?.join(" ");

        console.log(filteredStyle);
        const systemPrompt = rawMessages.length
          ? `${filteredStyle} ${opener}`
          : filteredStyle;

        const messageObjects = rawMessages
          .map((msg) => {
            return {
              role: msg.from == profile._id ? "user" : "assistant",
              content: msg.message,
            };
          })
          .reverse();

        const messages = [
          {
            role: "system",
            content: systemPrompt,
          },
          ...messageObjects,
        ];

        const chatBody = {
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.2,
          max_tokens: 40,
          stop: ["#"],
          frequency_penalty: 1,
          logit_bias: { 198: -100, 25: -100, 50256: -100, 1: -100 },
        };

        const message = await api.generateMessage(chatBody);
        console.log(message);

        // console.log(await api.sendMessage(match._id, message));
      }
    } catch (error) {
      console.log(error);

      setAutoChatting(false);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Chadbot</title>
        <meta name="description" content="More dates and more time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.webp" />
      </Head>
      <main
        className={
          "flex flex-col items-center justify-center h-screen bg-[url('/images/multi-chad.jpeg')]"
        }
      >
        <div class="flex flex-col md:flex-row bg-slate-800 p-10">
          <div class="w-full md:w-1/2 h-64 md:h-auto px-5">
            <div className="justify-left text-left">
              <h2 className="text-2xl text-white"> Settings:</h2>
              <label className="block text-white mb-2" htmlFor="style">
                Configure the GPT prompt to your liking.
              </label>
              <textarea
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                Configure the text fragment that will be added to the prompt
                when it is the first message (opener).
              </label>
              <textarea
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          </div>
          <div class="w-full md:w-1/2 h-64 md:h-auto px-5">
            <div className="flex-row flex justify-around">
              <div className="px-2 text-white">
                Matches: {matches?.length ?? "loading..."}
              </div>
              <div>
                <label
                  className="inline-block pr-[0.15rem] hover:cursor-pointer text-white"
                  htmlFor="flexSwitchCheckDefault"
                >
                  Auto chat
                </label>
                <input
                  className="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-500 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-blue-500 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-500 dark:checked:after:bg-blue-500"
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

            <h2 className="p-3 text-xl my-5 text-white">
              Click the button below to respond to all matches and open new
              ones.
            </h2>
            <button
              className={`bg-blue-500 p-3 text-white w-100 ${
                loading ? "opacity-50" : ""
              }`}
              disabled={loading}
              onClick={async () => await chat()}
            >
              {loading ? "AutoChatting..." : "Chat now"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
