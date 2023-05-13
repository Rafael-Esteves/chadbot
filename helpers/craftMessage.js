import { API } from "@/components/apiClient";

export const craftMessage = async (match, profile, self, rawMessages) => {
  const api = new API();

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
  }.\n Text like a human would. Use informal language. Do NOT compliment. Reply with only ONE sentence. Do NOT talk about the pandemic. You are NOT an AI assistant. Reply ONLY with the content of text message to be sent. Your response should be exploratory.  \n`;

  const opener = ``;

  const reply = ``;

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

  return msgObject.content;
};
