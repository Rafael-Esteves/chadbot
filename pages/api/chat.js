// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TinderApi } from "../../tinder";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const tinder = new TinderApi(req.body.token);

  const processMessage = (msg) => {
    let split = msg.split("?")[0];
    if (msg.includes("?")) {
      split = split + "?";
    }

    return split;
  };

  try {
    const matches = await tinder.getMatches();
    console.log("Matches: ", matches.length);
    for (let match of matches) {
      const profile = await tinder.getProfile(match);

      const name = profile.name.split(" ")[0];

      console.log("Name: ", name);

      const rawMessages = await tinder.getMessages(match);

      const phoneRegex =
        /(\+55\s*\(?([1-9]{2})\)?\s*)?9\s*([6789]\d{3}[-\s]?\d{4})/g;

      if (rawMessages.length && rawMessages[0].from != profile._id) {
        console.log("Not your turn");
        continue;
      } else {
        const phoneNumba = rawMessages.forEach((msg) => {
          const match = msg.message.match(phoneRegex);
          if (match && msg.from == profile._id) return match;
        });
        if (phoneNumba) {
          console.log("Gotcha: ", phoneNumba);
          continue;
        }
      }

      const interests = profile.user_interests?.selected_interests.map(
        (interest) => interest.name
      );

      const interestsString = () => {
        let string = "";
        if (interests) {
          string = `Interesses: `;
          interests.forEach((int) => {
            string = string + int + ", ";
          });
        }
        return string;
      };

      const moreInfo = profile.selected_descriptors?.map((descriptor) => {
        return `${descriptor.name}: ${descriptor.choice_selections[0].name}.`;
      });

      const city = profile.city
        ? `Cidade onde ${name} mora: ${profile.city.name}`
        : "";

      const distance = parseInt(profile.distance_mi / 0.621371);

      const self = await tinder.getSelf();
      const user = self.user;
      const cityFrag = user.city
        ? `, mora em ${user.city.name} ${
            user.city.region ? ", " + user.city.region : ""
          }`
        : "";

      //   const personality = `Sua personalidade: Homem mineiro de 26 anos, morando no bairro Campeche em Florianópolis. Misterioso. Signo: Libra.`;
      const personality = `Você é ${user.name}. Sexo ${
        user.gender == 0 ? "masculino" : "feminino"
      } ${cityFrag}.`;

      const style = `A mensagem deve ser escrita de maneira informal além de ser curta e direta ao ponto. A mensagem deve ter um tom de flerte. A mesagem não deve se explicar e nem se justificar. Não seja prolixo. Utilize algumas gírias para dar um tom mais descontraído à mensagem.`;

      const context = `Para criar a mensagem, utilize as informações fornecidas pelo match, incluindo: ${
        interestsString() ?? ""
      }. ${city ?? ""}. Distância entre vocês: ${distance}km. ${moreInfo?.join(
        " "
      )}`;

      const opener = `Crie uma mensagem de abertura personalizada para um match feminino no Tinder, que inclua o nome do match, ${name}, e uma pergunta direcionada a um dos interesses dela. A mensagem deve ter o foco principal na pergunta. A mensagem não deve conter nada além da pergunta. `;

      const step2 = `Casualmente, sugira um encontro ${
        user.city ? " em " + user.city.name : ""
      }.  O encontro pode ser em um restaurante ou bar.`;

      const step3 = `Você está livre no próximo sábado e domingo na parte da tarde e da noite.`;

      const step4 = `Sugira continuar a conversa ou acertar os detalhes por whatsapp. Seu número: ${user.phone_id}`;
      const messageObjects = rawMessages
        .map((msg) => {
          return {
            role: msg.from == profile._id ? "user" : "assistant",
            content: msg.message,
          };
        })
        .reverse();

      const systemPrompt = () => {
        switch (rawMessages.length) {
          case 0:
            return `${personality} ${opener} ${style} ${context}`;
          case 1:
          case 2:
          case 3:
            return `${personality} ${step2} ${style} ${context}  `;
          case 4:
          case 5:
          case 6:
            return `${personality} ${step3} ${style} ${context}  `;

          default:
            return `${personality} ${step4} ${style} ${context}   `;
        }
      };

      const messages = [
        {
          role: "system",
          content: systemPrompt(),
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

      const resp = await openai.createChatCompletion(chatBody);

      console.log("unprocessed", resp.data.choices[0].message);

      const message = processMessage(resp.data.choices[0].message.content);

      console.log(messages);
      console.log(message);

      //   console.log(await tinder.sendMessage(match, message));
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
