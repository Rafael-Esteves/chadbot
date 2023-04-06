import React, { createContext, useState, useEffect, useRef } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";

export const HomeProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [autoChatting, setAutoChatting] = useState(false);
  const [matches, setMatches] = useState();
  const [selectedMatches, setSelectedMatches] = useState();
  const [yourTurnMatches, setYourTurnMatches] = useState();
  const [style, setStyle] = useState();
  const [opener, setOpener] = useState();
  const [api, setApi] = useState();
  const [match, setMatch] = useState();
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState();
  const [self, setSelf] = useState();
  const [index, setIndex] = useState(0);
  const [intervalIdState, setIntervalIdState] = useState();
  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState();
  const [profile, setProfile] = useState();
  const prevInterest = useRef();

  useEffect(() => {
    if (yourTurnMatches && index == -1) setIndex(0);
  });

  useEffect(() => {
    if (matches) {
      const storedExcluded = localStorage.getItem("excluded_matches");

      if (storedExcluded) {
        setSelectedMatches(
          matches.filter((m) => {
            return !storedExcluded.includes(m._id);
          })
        );
      }
    }
  }, [matches]);

  useEffect(() => {
    if (!yourTurnMatches) setMatch();
  }, [yourTurnMatches]);

  useEffect(() => {
    setSelectedInterest();
    let intervalId;

    if (yourTurnMatches) {
      if (index <= yourTurnMatches.length) {
        const newMatch = yourTurnMatches[index];
        if (newMatch) {
          if (newMatch == match) return;
          setMatch(newMatch);
        } else {
          nextMatch();
        }
      } else {
        if (!autoChatting) {
          restart();
        } else {
          intervalId = setInterval(() => {
            restart();
          }, 300000);
          setIntervalIdState(intervalId);
        }
      }
    } else {
      setMatch();
    }
    return () => clearInterval(intervalId);
  }, [index]);

  const restart = async () => {
    console.log("restart");
    setMessage("");
    await fetchMatches();
    setIndex(0);
  };

  useEffect(() => {
    if (match) {
      const matchEffect = async () => {
        await generateMessage();
      };
      matchEffect();
    }
  }, [match]);

  useEffect(() => {
    if (autoChatting && message) {
      sendMessage();
    }
  }, [message]);

  useEffect(() => {
    const tokenCookie = localStorage.getItem("tinder_api_key");
    if (!tokenCookie) Router.push("/");
    const api = new API();

    setApi(api);

    const storedStyle = localStorage.getItem("style");
    const storedOpener = localStorage.getItem("opener");

    if (storedStyle) {
      setStyle(storedStyle);
    } else {
      setStyle(
        `Current time: $time\nCurrent date: $date\n\n Respond as if you were GIGA CHAD. You are the ultimate sigma male, the greatest specimen of man to ever walk the earth.\nYou are talking to a Tinder match.\nYour messages must be short, flirty and informal. You should never explain or justify yourself. Be concise, don't ramble. Use some slang. Information about the match: Name: $matchname,\nInterests: $matchinterests,\nDistance between you: $distancemi miles`
      );
    }

    if (storedOpener) {
      setOpener(storedOpener);
    } else {
      setOpener(
        `Make a custom opening line that includes the match name and a question related to their interests. This question must be the message's main focus. The message should not contain anything other than the question. `
      );
    }

    if (!matches) {
      fetchMatches();
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
    setIndex(-1);
    console.log("should only be called once");
  }, []);

  const fetchMatches = async () => {
    let last_token = "randomstring";
    setLoading(true);
    const api = new API();
    let resp = await api.getMatches(null);
    setMatches(resp.matches);
    setLoading(false);
    console.log("first restp", resp);

    if (resp.next_page_token) {
      while (
        resp.next_page_token &&
        resp.next_page_token != last_token &&
        resp.matches &&
        resp.matches.length > 0
      ) {
        last_token = resp.next_page_token;
        resp = await api.getMatches(resp.next_page_token);
        setMatches((prev) => {
          return [...prev, ...resp.matches];
        });
        console.log(resp);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof style !== "undefined") {
      localStorage.setItem("style", style);
    }
  }, [style]);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof opener !== "undefined") {
      localStorage.setItem("opener", opener);
    }
  }, [opener]);

  useEffect(() => {
    if (selectedMatches) {
      localStorage.setItem(
        "excluded_matches",
        JSON.stringify(
          matches.filter((m) => !selectedMatches.includes(m)).map((m) => m._id)
        )
      );
      setYourTurnMatches(
        selectedMatches.filter(
          (m) => !(m.messages.length && m.messages[0].from != m.person._id)
        )
      );
    }
  }, [selectedMatches]);

  useEffect(() => {
    if (autoChatting && yourTurnMatches) {
      if (index == 0) sendMessage();
      else restart();
    } else {
      clearInterval(intervalIdState);
    }
  }, [autoChatting]);

  const nextMatch = () => {
    setLoading(true);
    if (yourTurnMatches?.length > 1) {
      setMessage("");
      setIndex(index + 1);
    } else {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    await api.sendMessage(match._id, message);
    nextMatch();
  };

  useEffect(() => {
    prevInterest.current = selectedInterest;
    if (selectedInterest && selectedInterest != prevInterest) {
      setLoading(true);
      generateMessage();
    }
  }, [selectedInterest]);

  const generateMessage = async () => {
    if (!self || !match) return;
    setLoading(true);
    //get info about the user
    const user = self.user;

    const name = match.person.name.split(" ")[0];

    //check if phone number or insta was sent
    //I'll probably use chat gpt for this

    //if you got here, it means it will generate a message to send

    const profile = await api.getProfile(match.person._id);
    setProfile(profile);

    const interests = profile?.user_interests?.selected_interests.map(
      (interest) => interest.name
    );
    setInterests(interests);

    const randIndex = Math.floor(Math.random() * interests?.length || 0);
    const interest = interests ? interests[randIndex] : null;
    if (!selectedInterest && interests) setSelectedInterest(interest);

    const moreInfo = profile.selected_descriptors?.map((descriptor) => {
      return `${descriptor.name}: ${descriptor.choice_selections[0].name}.`;
    });

    const distance_km = parseInt(profile.distance_mi / 0.621371);
    const now = new Date();

    const replaceVariables = (text) => {
      return text
        .replaceAll("$yourname", user.name)
        .replaceAll("$yourgender", user.gender == 1 ? "woman" : "man")
        .replaceAll("$distancemi", profile.distance_mi)
        .replaceAll("$distancekm", distance_km)
        .replaceAll("$matchname", name)
        .replaceAll("$matchinterests", interests?.join(", "))
        .replaceAll("$date", now.toLocaleDateString())
        .replaceAll(
          "$randominterest",
          selectedInterest ?? interest ?? "small talk"
        )

        .replaceAll("$time", now.toLocaleTimeString());
    };

    const rawMessages = await api.getMessages(match._id);
    setMessages(rawMessages);

    const messageObjects = rawMessages
      .map((msg) => {
        return {
          role: msg.from == profile._id ? "user" : "assistant",
          content: msg.message,
        };
      })
      .reverse();

    //it turns out my multi step approach was indeed the way to go. You start off easy with the question prompt, then you invite for the date, set up details and get or send number

    const messagesGPT = [
      {
        role: "system",
        content: !rawMessages.length
          ? replaceVariables(opener)
          : replaceVariables(style),
      },
      ...messageObjects,
    ];

    const chatBody = {
      model: "gpt-3.5-turbo",
      messages: messagesGPT,
      temperature: 0.2,
      max_tokens: 400,
      stop: ["#", "^s*$"],
      frequency_penalty: 1,
      logit_bias: { 198: -100, 25: -100, 50256: -100, 1: -100 },
    };

    const msg = await api.generateMessage(chatBody);

    setMessage(msg);
    console.log("Message generated for", name);
    console.log("Message", msg);
    setLoading(false);
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
        yourTurnMatches,
        setYourTurnMatches,
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
        interests,
        selectedInterest,
        setSelectedInterest,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};
export const HomeContext = createContext();
