// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);
    const phone = req.body.phone;

    const customerResults = await stripe.customers.search({
      query: `phone: '${phone}'`,
    });

    const customer = customerResults.data.length
      ? customerResults.data[0]
      : await stripe.customers.create({
          phone: phone,
        });

    res.status(200).json(customer);
  } catch (err) {
    res.status(err).send(err);
  }
}
