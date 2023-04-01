import React, { createContext, useState, useEffect } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";

export const HomeProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [autoChatting, setAutoChatting] = useState(false);
  const [matches, setMatches] = useState();
  const [selectedMatches, setSelectedMatches] = useState([]);
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
      setStyle(storedStyle);
    } else {
      setStyle(
        `Current time: $time\nCurrent date: $date\n\nYou are $yourname, a $yourgender.\nYou are talking to a Tinder match.\nYour messages must be short, flirty and informal. You should never explain or justify yourself. Be concise, don't ramble. Use some slang. Information about the match: Name: $matchname,\nInterests: $matchinterests,\nDistance between you: $distancemi miles`
      );
    }

    if (storedOpener) {
      setStyle(storedOpener);
    } else {
      setOpener(
        `Make a custom opening line that includes the match name and a question related to their interests. This question must be the message's main focus. The message should not contain anything other than the question. `
      );
    }

    if (!matches) {
      const api = new API();
      const uncessaryAsync = async () => {
        const resp = await api.getMatches();
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
    console.log(selectedMatches);
    if (
      typeof window !== "undefined" &&
      selectedMatches &&
      typeof selectedMatches != "undefined" &&
      selectedMatches.length &&
      selectedMatches[0] !== "undefined"
    ) {
      console.log("setting selected matches", selectedMatches);
      localStorage.setItem("selected_matches", selectedMatches);
    }
  }, [selectedMatches]);

  useEffect(() => {
    if (typeof window !== "undefined" && matches) {
      const localSelected = localStorage.getItem("selected_matches");

      if (!localSelected) {
        console.log("no local selected");
        setSelectedMatches(matches.map((m) => m._id));
      } else {
        setSelectedMatches(localSelected.split(","));
      }
    }
  }, [matches]);

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
      const matchesSelected = matches.filter((match) =>
        selectedMatches.includes(match._id)
      );

      for (let match of matchesSelected) {
        const name = match.person.name.split(" ")[0];
        console.log(name);

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
    <HomeContext.Provider
      value={{
        loading,
        setLoading,
        autoChatting,
        setAutoChatting,
        matches,
        setMatches,
        selectedMatches,
        setSelectedMatches,
        style,
        setStyle,
        opener,
        setOpener,
        chat,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};
export const HomeContext = createContext();
