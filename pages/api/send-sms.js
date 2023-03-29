// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendCode } from "@/tinder";

export default function handler(req, res) {
  const respond = async () => {
    const response = await sendCode(req.body.phone);
    res.status(200).json(response);
  };
  respond();
}
