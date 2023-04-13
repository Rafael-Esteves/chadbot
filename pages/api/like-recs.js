// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { TinderApi } from "../../tinder";

export default async function handler(req, res) {
  try {
    const tinder = new TinderApi(
      req.body.token,
      req.headers["accept-language"]
    );
    const response = await tinder.likeRecs();
    res.status(200).json(response);
  } catch (err) {
    res.status(err).send(err);
  }
}
