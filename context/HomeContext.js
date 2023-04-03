import React, { createContext, useState, useEffect } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";

export const HomeProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [autoChatting, setAutoChatting] = useState(false);
  const [matches, setMatches] = useState();
  const [selectedMatches, setSelectedMatches] = useState();
  const [style, setStyle] = useState();
  const [opener, setOpener] = useState();
  const [api, setApi] = useState();
  const [match, setMatch] = useState();
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState();
  const [self, setSelf] = useState();
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const tokenCookie = localStorage.getItem("tinder_api_key");
    if (!tokenCookie) Router.push("/");
  });

  useEffect(() => {
    if (selectedMatches) {
      const newMatch = selectedMatches[index];
      if (
        newMatch &&
        newMatch != match &&
        !(
          newMatch.messages.length &&
          newMatch.messages[0].from != newMatch.person._id
        )
      ) {
        setMatch(newMatch);
      } else {
        nextMatch();
      }
    }
  }, [index]);

  useEffect(() => {
    if (match) {
      const matchEffect = async () => {
        setLoading(true);
        await generateMessage();
        if (autoChatting) {
          await sendMessage();
        }
        setLoading(false);
      };
      matchEffect();
    }
  }, [match]);

  useEffect(() => {
    if (selectedMatches) {
      setIndex(0);
    }
  }, [selectedMatches]);

  useEffect(() => {
    const api = new API();

    setApi(api);

    const storedStyle = localStorage.getItem("style");
    const storedOpener = localStorage.getItem("opener");
    const storedExcluded = localStorage.getItem("excluded_matches");

    if (storedStyle) {
      setStyle(storedStyle);
    } else {
      setStyle(
        `Current time: $time\nCurrent date: $date\n\n Respond as if you were GIGA CHAD. You are the ultimate sigma male, the greatest specimen of man to ever walk the earth.\nYou are talking to a Tinder match.\nYour messages must be short, flirty and informal. You should never explain or justify yourself. Be concise, don't ramble. Use some slang. Information about the match: Name: $matchname,\nInterests: $matchinterests,\nDistance between you: $distancemi miles`
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
      const matchesEffect = async () => {
        setLoading(true);
        const resp = await api.getMatches();
        setMatches(resp);
        if (storedExcluded) {
          setSelectedMatches(
            resp.filter((m) => {
              return !storedExcluded.includes(m._id);
            })
          );
        } else {
          setSelectedMatches(resp);
        }

        setLoading(false);
      };
      matchesEffect();
    } else {
      nextMatch();
    }

    if (!self) {
      const selfEffect = async () => {
        setLoading(true);
        const resp = await api.getSelf();
        setSelf(resp);
        setLoading(false);
      };
      selfEffect();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof style !== "undefined") {
      localStorage.setItem("style", style);
    }
  }, [style]);

  useEffect(() => {
    if (selectedMatches) {
      localStorage.setItem(
        "excluded_matches",
        JSON.stringify(
          matches.filter((m) => !selectedMatches.includes(m)).map((m) => m._id)
        )
      );
    }
  }, [selectedMatches]);

  useEffect(() => {
    let intervalId;

    if (autoChatting) {
      //sending the current message starts the whole waterfall of effects that keeps things going
      console.log("index:", index);
      console.log("Selected matches length", selectedMatches.length);
      if (index >= selectedMatches.length) {
        console.log("inside truthy");
        intervalId = setInterval(() => {
          console.log("inside interval");
          setIndex(0);
        }, 300000);
      }
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [index]);

  useEffect(() => {
    if (autoChatting) {
      if (index == 0) sendMessage();
      else setIndex(0);
    }
  }, [autoChatting]);

  const nextMatch = () => {
    console.log("next match, index:", index);
    setMessage("");
    if (index > selectedMatches.length) {
      if (!autoChatting) setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  const sendMessage = async () => {
    await api.sendMessage(matches[index]._id, message);
    console.log("send message");
    nextMatch();
  };

  const generateMessage = async () => {
    //get info about the user
    const user = self.user;

    const name = match.person.name.split(" ")[0];

    //check if phone number or insta was sent
    //I'll probably use chat gpt for this

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

    const replaceVariables = (text) => {
      return (
        text
          .replace("$yourname", user.name)
          .replace("$yourgender", user.gender == 1 ? "woman" : "man")
          .replace("$distancemi", profile.distance_mi)
          .replace("$distancekm", distance_km)
          .replace("$matchname", name)
          .replace("$matchinterests", interestsString())
          .replace("$date", now.toLocaleDateString())

          .replace("$time", now.toLocaleTimeString()) + moreInfo?.join(" ")
      );
    };

    const rawMessages = await api.getMessages(match._id);
    console.log(rawMessages);

    setMessages(rawMessages);

    const systemPrompt = rawMessages.length
      ? `${replaceVariables(style)} ${replaceVariables(opener)}`
      : replaceVariables(style);

    const messageObjects = rawMessages
      .map((msg) => {
        return {
          role: msg.from == profile._id ? "user" : "assistant",
          content: msg.message,
        };
      })
      .reverse();

    const messagesGPT = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messageObjects,
    ];

    const chatBody = {
      model: "gpt-3.5-turbo",
      messages: messagesGPT,
      temperature: 0.2,
      max_tokens: 100,
      stop: ["#"],
      frequency_penalty: 1,
      logit_bias: { 198: -100, 25: -100, 50256: -100, 1: -100 },
    };

    const msg = await api.generateMessage(chatBody);
    setMessage(msg);
    return msg;
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
        match,
        setMatch,
        message,
        setMessage,
        sendMessage,
        generateMessage,
        nextMatch,
        messages,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};
export const HomeContext = createContext();
