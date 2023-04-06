// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TinderApi } from "../../tinder";

export default async function handler(req, res) {
  try {
    const tinder = new TinderApi(null, req.headers["accept-language"]);
    const response = await tinder.getApiToken(req.body.code, req.body.phone);
    res.status(200).json(response);
  } catch (err) {
    res.status(err).send(err);
  }
}
