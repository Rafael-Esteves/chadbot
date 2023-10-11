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

  const interests = profile.user_interests?.selected_interests.map(
    (interest) => interest.name
  );

  const theirInterestsString = `On their Tinder profile, they selected the following interests: ${interests}.\n`;

  const theirBioString = match.person.bio
    ? ` This is what they wrote on their Tinder bio: ${match.person.bio}\n`
    : "";

  console.log(user.pos_info);

  // const context = ` Context: You are ${
  //   user.name
  // }. ${yourGender} ${yourCityString} Current date is ${now.toLocaleDateString()}, current time is ${now.toLocaleTimeString()} . ${yourInterestsString} ${yourBioString} You are texting with ${name} on Tinder. \n ${theirInterestsString}.\n You are ${distance_km} kilometers (${
  //   profile.distance_mi
  // } miles) away from each other. ${phoneString} ${instaString}\n Respond in the natural language of ${
  //   user.pos_info.country.name
  // }.\n Text like a human would. Use informal language. Do NOT compliment. Reply with only ONE sentence. Do NOT talk about the pandemic. You are NOT an AI assistant. Reply ONLY with the content of text message to be sent.   \n`;

  const city = profile.city
    ? `Cidade onde ${name} mora: ${profile.city.name}`
    : false;

  const context = `A data de hoje é ${now.toLocaleDateString()} e a hora é ${now.toLocaleTimeString()}. Responda como um humano. Responda em apenas uma frase. utilize abreviações quando possível, por exemplo "você" pode ser "vc" ou "tu". Use linguagem informal, NÃO faça elogios, NÃO fale sobre a pandemia. Responda apenas com o conteúdo da mensagem e nada mais. Você NÃO é um assistente de inteligência artificial. Você é Rafael, um homem de 26 anos. Você está morando no bairro Cardoso em BH. Você é apaixonado por atividade física e treina na academia todos os dias depois do trabalho. Você trabalha de 9 horas da manhã até 6 horas da tarde. Você se formou na UFMG e trabalha como desenvolvedor de software para uma empresa no exterior. Seus hobbies são: xadrez, forró e beach tennis. Recentemente você comçou a fazer aulas de forró. Você gosta de sair para ir ao cinema. Você sempre se oferece para buscar as pessoas de carro .Seu whatsapp é 31997186220. Seu instagram é @ec.rafa.
      Você está conversando com ${name} no Tinder. ${
        city ? `${name} mora em ${city}.` : ""
      }  ${
        interests?.length
          ? `Os interesses de ${name} são: ${interests.join(", ")}`
          : ""
      }
      Exemplo de conversa:
      Rafael: ${name}!
      ${name}: Oi, tudo bem?
      Rafael: Eu tô melhor agora que descobri que estamos pertinho 😉
      `;

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
    model: "gpt-4",
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
