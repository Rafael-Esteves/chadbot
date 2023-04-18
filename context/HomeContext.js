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
    else if (index == -1) {
      setIndex(0);
    } else if (yourTurnMatches[index]) setMatch(yourTurnMatches[index]);
  }, [yourTurnMatches]);

  useEffect(() => {
    console.log(yourTurnMatches);
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
    console.log("inside next match, current index:", index);
    console.log("inside next match, yourTurnM", yourTurnMatches);
    setMessage("");
    setIndex(index + 1);
  };

  const sendMessage = async (match, message) => {
    setLoading(true);
    const result = await api.sendMessage(match._id, message);
    // const result = { sent_date: true };
    //remove match from yourturn

    console.log("Send message result", result);
    if (result.sent_date) {
      setSelectedMatches((prev) => prev.filter((m) => m._id != match?._id));
      console.log("Message:", message);
      console.log("Sent to:", match.person.name);
    } else {
      console.log("Message not sent.");
    }
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

        setSelectedInterest(interest);
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

    console.log("generating");

    const subscription = await api.getSubscription();

    if (!["trialing", "active"].includes(subscription.status)) {
      setShowTrialExpiredModal(true);
      return;
    }

    console.log(selectedInterest);

    setLoading(true);
    //get info about the user
    const user = self.user;
    console.log(self);

    const name = match.person.name.split(" ")[0];

    //check if phone number or insta was sent
    //I'll probably use chat gpt for this

    //if you got here, it means it will generate a message to send

    // const moreInfo = profile.selected_descriptors?.map((descriptor) => {
    //   return `${descriptor.name}: ${descriptor.choice_selections[0].name}.`;
    // });

    //figure out language

    const distance_km = parseInt(profile.distance_mi / 0.621371);
    const now = new Date();

    const yourInterests = profile?.user_interests?.selected_interests.map(
      (interest) => interest.name
    );

    const randIndex = Math.floor(Math.random() * interests?.length || 0);

    const yourInterestsString = yourInterests
      ? "You like " + yourInterests[randIndex]
      : "";
    const phoneString = user.phone_id
      ? `Your phone number is +${user.phone_id}.`
      : "";

    const bioString = `This is their bio: ${match.person.bio}`;

    const instaString = self.instagram?.username
      ? `Your instagram username is ${self.instagram.username}.`
      : "";

    const interestString = selectedInterest
      ? `${name} claims to like ${selectedInterest}`
      : null;

    const language = `Respond in the natural language of ${user.pos_info.country.name}.\n `;

    const yourGender = `You are a ${user.gender == 0 ? "man" : "woman"}.`;

    const context = `Context: You are ${user.name}. ${yourGender} You live in ${
      user.city.name
    } Current date is ${now.toLocaleDateString()}, current time is ${now.toLocaleTimeString()} do NOT talk about the pandemic. ${yourInterestsString} You are texting back and forth with ${name}, a person you matched on Tinder.\n`;

    const style = `Use informal language. Do NOT compliment, prefer short and witty messages. Be lighthearted and fun. Make sure it's NOT cringy. \n`;

    const opener = `${yourGender} You just matched with ${name} on Tinder. Send them a witty pick up line. Avoid compliments, use double entendres. ${
      interestString ?? bioString
    }`;
    const goal1 = `Go with the flow. Ask them questions about the content of their messages to show interest in the conversation.`;
    const goal2 = `Go with the flow. `;
    const goal3 = `Casually suggest going out with ${name} in ${user.city.name}.`;

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

    let systemMsg;
    switch (rawMessages.length) {
      case 0:
        systemMsg = language + style + opener;
        break;
      case rawMessages.length < 4:
        systemMsg = context + language + style + goal1;
        break;
      case rawMessages.length < 8:
        systemMsg = context + language + style + goal2;
        break;
      case rawMessages.length < 12:
        systemMsg = context + language + style + goal3;
        break;
      case rawMessages.length > 20 && rawMessages.length < 25:
        systemMsg = context + language + style + goal3;
        break;
      default:
        systemMsg =
          context + language + phoneString + instaString + style + goal1;
    }

    //it turns out my multi step approach was indeed the way to go. You start off easy with the question prompt, then you invite for the date, set up details and get or send number

    const messagesGPT = [
      {
        role: "system",
        content: systemMsg,
      },
      ...messageObjects,
    ];

    const chatBody = {
      model: "gpt-3.5-turbo",
      messages: messagesGPT,
      temperature: 0.4,
      max_tokens: 400,
      stop: ["#", "^s*$"],
      frequency_penalty: 0.5,
      logit_bias: { 198: -100, 25: -100, 50256: -100, 1: -100, 5540: -100 },
    };

    const msg = await api.generateMessage(chatBody);

    setMessage(msg);

    if (autoChatting) await sendMessage(match, msg);
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
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};
export const HomeContext = createContext();
