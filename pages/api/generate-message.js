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

    console.log("response", response);

    const message = response.data.choices[0].message;
    console.log(message);
    res.status(200).json(message);
  } catch (err) {
    res.status(err).send(err);
  }
}


