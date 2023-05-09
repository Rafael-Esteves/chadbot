import React, { createContext, useState, useEffect, useRef } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";

export const HomeProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [autoChatting, setAutoChatting] = useState(false);
  const [matches, setMatches] = useState();
  const [selectedMatches, setSelectedMatches] = useState();
  const [yourTurnMatches, setYourTurnMatches] = useState();
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
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);
  const [showLockedFeatureModal, setShowLockedFeatureModal] = useState(false);
  const [subscription, setSubscription] = useState();
  const [autoLikeRecs, setAutoLikeRecs] = useState(false);
  const [recsInterval, setRecsInterval] = useState();
  const [showSelectedMatches, setShowSelectedMatches] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

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
    if (!yourTurnMatches?.length) setMatch() && setLoading(false);
    else if (index == -1) {
      setIndex(0);
    } else if (yourTurnMatches[index]) setMatch(yourTurnMatches[index]);
  }, [yourTurnMatches]);

  useEffect(() => {
    setLoading(true);
    if (index == -1) {
      if (!matches) fetchMatches();
      if (!subscription) fetchSubscription();
      if (!self) fetchSelf();
    }

    let intervalId;

    if (yourTurnMatches?.length) {
      if (index <= yourTurnMatches.length) {
        const newMatch = yourTurnMatches[index];
        if (newMatch) {
          const newMatchEffect = async () => {
            setMatch(newMatch);
          };
          newMatchEffect();
        } else {
          nextMatch();
        }
      } else {
        setMatch();
        if (autoChatting) {
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
    setMessage("");
    await fetchMatches();
    setIndex(-1);
  };

  useEffect(() => {
    const api = new API();

    setApi(api);

    setIndex(-1);
  }, []);

  const fetchSelf = async () => {
    setLoading(true);
    setSelf(await api.getSelf());
    setLoading(false);
  };

  const fetchSubscription = async () => {
    setLoading(true);
    setSubscription(await api.getSubscription());
    setLoading(false);
  };

  const fetchMatches = async () => {
    let last_token = "randomstring";
    setLoading(true);
    // const api = new API();
    let resp = await api.getMatches(null);
    setMatches(resp.matches);

    setLoading(false);

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
      }
    }
  };

  useEffect(() => {
    if (selectedMatches) {
      localStorage.setItem(
        "excluded_matches",
        JSON.stringify(
          matches.filter((m) => !selectedMatches.includes(m)).map((m) => m._id)
        )
      );
      if (yourTurnMatches)
        setYourTurnMatches(
          selectedMatches.filter((m) => yourTurnMatches.includes(m))
        );
      else
        setYourTurnMatches(
          selectedMatches.filter(
            (m) => !(m.messages.length && m.messages[0].from != m.person._id)
          )
        );
    }
  }, [selectedMatches]);

  useEffect(() => {
    if (autoChatting && subscription.status != "active") {
      setShowLockedFeatureModal(true);
      setAutoChatting(false);
      return;
    }
    const autoChattingEffect = async () => {
      if (autoChatting && yourTurnMatches) {
        if (index == 0 && match) await sendMessage(match, message);
        else setIndex(-1);
      } else {
        clearInterval(intervalIdState);
      }
    };
    autoChattingEffect();
  }, [autoChatting]);

  const nextMatch = () => {
    setMessage("");
    setIndex(index + 1);
  };

  const sendMessage = async (match, message) => {
    setLoading(true);
    await api.sendMessage(match._id, message);
    //remove match from yourturn
    setYourTurnMatches((prev) => prev.filter((m) => m._id != match?._id));
  };

  const goToPortal = async () => {
    setLoading(true);
    const portalUrl = await api.getPortalUrl();
    window.location.href = portalUrl;
    setLoading(false);
  };

  const likeRecs = async () => {
    setLoading(true);
    await api.likeRecs();
    setLoading(false);
  };

  useEffect(() => {
    let interval;
    if (autoLikeRecs) {
      likeRecs();
      interval = setInterval(() => {
        likeRecs();
      }, 86400000);
      setRecsInterval(interval);
    } else {
      clearInterval(recsInterval);
    }
  }, [autoLikeRecs]);

  useEffect(() => {
    if (match) {
      setMessage();
      setSelectedInterest();
      setMessages([]);
      const matchEffect = async () => {
        const profile = await api.getProfile(match.person._id);
        setProfile(profile);

        const interests = profile?.user_interests?.selected_interests.map(
          (interest) => interest.name
        );
        setInterests(interests);

        const randIndex = Math.floor(Math.random() * interests?.length || 0);
        const interest = interests ? interests[randIndex] : null;

        // setSelectedInterest(interest);
      };
      matchEffect();
    } else {
      setLoading(false);
    }
  }, [match]);

  useEffect(() => {
    if (profile) {
      const profileEffect = async () => {
        setLoading(true);
        await generateMessage();
        setLoading(false);
      };
      profileEffect();
    }
  }, [profile]);

  useEffect(() => {
    match && !loading && !autoChatting && generateMessage();
  }, [selectedInterest]);

  const generateMessage = async () => {
    if (!self || !match) return;

    const subscription = await api.getSubscription();

    if (!["trialing", "active"].includes(subscription.status)) {
      setShowTrialExpiredModal(true);
      return;
    }

    setLoading(true);

    const rawMessages = await api.getMessages(match._id);
    setMessages(rawMessages);

    if (rawMessages.length > 40) {
      !autoChatting && setLoading(false);
      return;
    }

    //get info about the user
    const user = self.user;

    const name = match.person.name.split(" ")[0];

    //check if phone number or insta was sent
    //I'll probably use chat gpt for this

    //if you got here, it means it will generate a message to send

    // const moreInfo = profile.selected_descriptors?.map((descriptor) => {
    //   return `${descriptor.name}: ${descriptor.choice_selections[0].name}.`;
    // });

    const messageObjects = rawMessages
      .map((msg) => {
        return {
          role: msg.from == profile._id ? "user" : "assistant",
          content: msg.message,
        };
      })
      .reverse();

    const distance_km = parseInt(profile.distance_mi / 0.621371);
    const now = new Date();

    //You

    const yourInterests = user.user_interests?.selected_interests.map(
      (interest) => interest.name
    );

    const yourInterestsString = yourInterests
      ? "These are the interests you selected on your Tinder profile: " +
        yourInterests
      : "";

    const yourBioString = user.bio
      ? ` This is you wrote on your Tinder bio: ${user.bio}\n`
      : "";

    const phoneString = user.phone_id
      ? `Your phone number is +${user.phone_id}.`
      : "You can't give your phone number right now.";

    const instaString = self.instagram?.username
      ? `Your instagram username is @${self.instagram.username}.`
      : "You do not have an instagram account.";

    const yourGender = `You are a ${user.gender == 0 ? "MALE" : "FEMALE"}.`;

    const yourCityString = user.city ? `You live in ${user.city.name}` : "";

    console.log(yourGender);

    //Them

    const theirInterests = profile.user_interests?.selected_interests.map(
      (interest) => interest.name
    );

    const theirInterestsString = `On their Tinder profile, they selected the following interests: ${theirInterests}.\n`;

    const theirBioString = match.person.bio
      ? ` This is what they wrote on their Tinder bio: ${match.person.bio}\n`
      : "";

    console.log(user.pos_info);

    const context = ` Context: You are ${
      user.name
    }. ${yourGender} ${yourCityString} Current date is ${now.toLocaleDateString()}, current time is ${now.toLocaleTimeString()} . ${yourInterestsString} ${yourBioString} You are texting with ${name} on Tinder. \n ${theirInterestsString} ${theirBioString}.\n You are ${distance_km} kilometers (${
      profile.distance_mi
    } miles) away from each other. ${phoneString} ${instaString}\n Respond in the natural language of ${
      user.pos_info.country.name
    }.\n Text like a human would. Use informal language. Do NOT compliment. Reply with only ONE sentence. Do NOT talk about the pandemic. You are NOT an AI assistant. Reply ONLY with the content of text message to be sent.  \n`;

    const opener = `Send the first text`;

    const reply = `Send your reply.`;

    const systemMsg = rawMessages.length ? context + reply : context + opener;
    // const systemMsg = "Do not respond.";

    //it turns out my multi step approach was indeed the way to go. You start off easy with the question prompt, then you invite for the date, set up details and get or send number

    const messagesGPT = [
      {
        role: "system",
        content: systemMsg,
      },
      ...messageObjects,
    ];

    // if (rawMessages.length > 4) {
    //   const checkIfIsFinishedPrompt = `Respond in JSON only! This is what your response should look like: { "date_set": true|false, "contact_info_exchanged": true|false } Has a date been agreed upon on the following chat? Have contact information been exchanged in the following chat?`;
    //   const messagesCheckFinished = [
    //     {
    //       role: "system",
    //       content: checkIfIsFinishedPrompt,
    //     },
    //     { role: "user", content: messageObjects },
    //   ];
    //   const body = {
    //     model: "gpt-3.5-turbo",
    //     messages: messagesCheckFinished,
    //     top_p: 0.1,
    //     max_tokens: 400,
    //   };
    //   const checkFinished = await api.generateMessage(body);
    //   console.log(checkFinished);
    // }

    const chatBody = {
      model: "gpt-3.5-turbo",
      messages: messagesGPT,
      temperature: 0.4,
      max_tokens: 400,
      stop: ["#", "^s*$"],
      logit_bias: { 198: -100, 25: -100, 50256: -100, 1: -100, 5540: -100 },
      presence_penalty: -0.5,
    };

    const msgObject = await api.generateMessage(chatBody);

    console.log("Pre processed:", msgObject.content);

    const msg = autoChatting
      ? processMessage(msgObject.content)
      : msgObject.content;

    console.log(msgObject.content);

    setMessage(msg);

    if (autoChatting) await sendMessage(match, msg);
    setLoading(false);
    return msg;
  };

  const processMessage = (msg) => {
    let split = msg.split("?")[0];
    if (msg.includes("?")) {
      split = split + "?";
    }

    return split;
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
        restart,
        showTrialExpiredModal,
        setShowTrialExpiredModal,
        api,
        showLockedFeatureModal,
        setShowLockedFeatureModal,
        goToPortal,
        autoLikeRecs,
        setAutoLikeRecs,
        subscription,
        setShowSelectedMatches,
        showSelectedMatches,
        showInfoModal,
        setShowInfoModal,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};
export const HomeContext = createContext();
