// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion(req.body.chat_body);

    let message = "";

    // console.log(response.data);

    for (const chunk of response.data) {
      console.log(chunk, "chunk");
      // console.log(decoder.decode(chunk));
      // message = message.concat(chunk.choices[0].delta);
      // console.log(message);
      // res.write(message);
    }

    res.status(200).send(message);
  } catch (err) {
    res.status(err).send(err);
  }
}
