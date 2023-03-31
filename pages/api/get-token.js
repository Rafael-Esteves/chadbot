// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TinderApi } from "../../tinder";

export default async function handler(req, res) {
  try {
    const response = await TinderApi.getApiToken(req.body.code, req.body.phone);
    res.status(200).json(response);
  } catch (err) {
    res.status(err).send(err);
  }
}
