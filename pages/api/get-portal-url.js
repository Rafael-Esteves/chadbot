// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);
    const customerId = req.body.customer_id;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
    });

    res.status(200).send(session.url);
  } catch (err) {
    res.status(err).send(err);
  }
}
