import React, { createContext, useState, useEffect } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";

export const HomeProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [autoChatting, setAutoChatting] = useState(false);
  const [matches, setMatches] = useState();
  const [excludedMatches, setExcludedMatches] = useState([]);
  const [style, setStyle] = useState();
  const [opener, setOpener] = useState();
  const [api, setApi] = useState();
  const [match, setMatch] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    const tokenCookie = localStorage.getItem("tinder_api_key");
    if (!tokenCookie) Router.push("/");
  });

  useEffect(() => {
    setApi(new API());

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
        setLoading(true);
        const resp = await api.getMatches();
        setMatches(resp);
        setLoading(false);
      };
      uncessaryAsync();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof style !== "undefined") {
      localStorage.setItem("style", style);
    }
  }, [style]);

  useEffect(() => {
    if (typeof window !== "undefined" && matches) {
      localStorage.setItem("excluded_matches", JSON.stringify(excludedMatches));
    }
  }, [excludedMatches]);

  useEffect(() => {
    if (typeof window !== "undefined" && matches) {
      const localExcluded = JSON.parse(
        localStorage.getItem("excluded_matches")
      );

      if (localExcluded) {
        setExcludedMatches(localExcluded);
      }
    }
  }, [matches]);

  useEffect(() => {
    let intervalId;

    if (autoChatting && !loading) {
      chat();

      intervalId = setInterval(() => {
        chat();
      }, 300000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [autoChatting]);

  const chat = async () => {
    try {
      console.log("running");
      //get info about the user
      const self = await api.getSelf();
      const user = self.user;

      //get matches
      const matchesSelected = matches.filter(
        (match) => !excludedMatches.includes(match._id)
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
        setMessage(message);
        setMatch(match);
        console.log(message);

        console.log(await api.sendMessage(match._id, message));
      }
      setLoading(false);
      // setMatch(null);
    } catch (error) {
      console.log(error);

      setAutoChatting(false);
      setMatch(null);
    }
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
        excludedMatches,
        setExcludedMatches,
        style,
        setStyle,
        opener,
        setOpener,
        match,
        message,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};
export const HomeContext = createContext();
