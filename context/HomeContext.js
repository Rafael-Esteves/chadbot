import React, { createContext, useState, useEffect, useRef } from "react";
import Router from "next/router";
import { API } from "@/components/apiClient";
import { craftMessage } from "../helpers/craftMessage";

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
    if (!matches?.length) setMatch() && setLoading(false);
    // else if (index == -1) {
    //   setIndex(0);
    // } else if (matches[index]) setMatch(matches[index]);
  }, [matches]);

  useEffect(() => {
    if (index == -1) {
      if (!matches) fetchMatches();
      if (!subscription) fetchSubscription();
      if (!self) fetchSelf();
    }

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
      }
    } else {
      setMatch();
    }
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
      return;
    }
    let intervalId;
    const autoChattingEffect = async () => {
      await autoChat();
    };
    if (yourTurnMatches) {
      if (autoChatting) {
        autoChattingEffect();

        intervalId = setInterval(() => {
          autoChattingEffect();
        }, Math.max(yourTurnMatches.length * 10000, 300000));
        setIntervalIdState(intervalId);
      } else {
        clearInterval(intervalId);
        location.reload();
      }
    }
  }, [autoChatting]);

  const nextMatch = () => {
    setMessage("");
    setIndex(index + 1);
  };

  const sendMessage = async (match, message) => {
    setLoading(true);
    await api.sendMessage(match._id, message);
    //remove match from yourturn
    // setYourTurnMatches((prev) => prev.filter((m) => m._id != match?._id));
    setLoading(false);
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
    setMessage();
    setSelectedInterest();
    setMessages([]);
    if (match) {
      const matchEffect = async () => {
        const profile = await api.getProfile(match.person._id);
        setProfile(profile);

        const interests = profile?.user_interests?.selected_interests.map(
          (interest) => interest.name
        );
        setInterests(interests);

        const randIndex = Math.floor(Math.random() * interests?.length || 0);
        const interest = interests ? interests[randIndex] : null;

        const rawMessages = await api.getMessages(match._id);
        setMessages(rawMessages);

        // setSelectedInterest(interest);
      };
      matchEffect();
    } else {
      setLoading(false);
    }
  }, [match]);

  // useEffect(() => {
  //   if (profile) {
  //     const profileEffect = async () => {
  //       setLoading(true);
  //       await generateMessage();
  //       setLoading(false);
  //     };
  //     profileEffect();
  //   }
  // }, [profile]);

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

    if (messages.length > 40) {
      !autoChatting && setLoading(false);
      return;
    }

    const message = await craftMessage(match, profile, self, messages);

    setMessage(message);

    setLoading(false);
    return message;
  };

  const autoChat = async () => {
    for (let match of yourTurnMatches) {
      const profile = await api.getProfile(match.person._id);
      const rawMessages = await api.getMessages(match._id);
      const message = await craftMessage(match, profile, self, rawMessages);
      await api.sendMessage(match._id, message);
    }
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
