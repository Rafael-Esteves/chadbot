// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  res.status(200).json({ status: "trialing" });

  // try {
  //   const stripe = new Stripe(process.env.STRIPE_API_KEY);
  //   const customerId = req.body.customer_id;

  //   const getCurrencyCode = (phoneCode) => {
  //     switch (phoneCode) {
  //       case "+1":
  //         return "usd";
  //       case "+55":
  //         return "brl";
  //       case "+46":
  //         return "sek";
  //       case "+47":
  //         return "nok";
  //       case "+44":
  //         return "gbp";
  //       case "+33":
  //         return "eur";
  //       case "+49":
  //         return "eur";
  //       case "+81":
  //         return "jpy";
  //       case "+86":
  //         return "cny";
  //       case "+91":
  //         return "inr";
  //       case "+27":
  //         return "zar";
  //       case "+61":
  //         return "aud";
  //       default:
  //         return "usd";
  //     }
  //   };

  //   const getCurrencyCodeFromPhone = (phoneNumber) => {
  //     const countryCode = phoneNumber.substring(
  //       0,
  //       phoneNumber.startsWith("+1") ? 2 : 3
  //     );
  //     const currencyCode = getCurrencyCode(countryCode);
  //     return currencyCode;
  //   };

  //   const customer = await stripe.customers.retrieve(customerId, {
  //     expand: ["subscriptions"],
  //   });

  //   const subscriptions = customer.subscriptions.data;

  //   const subscription = subscriptions.length
  //     ? subscriptions[0]
  //     : await stripe.subscriptions.create({
  //         customer: customerId,
  //         items: [{ price: process.env.PRICE_ID }],
  //         trial_period_days: 3,
  //         currency: getCurrencyCodeFromPhone(customer.phone),
  //         trial_settings: {
  //           end_behavior: {
  //             missing_payment_method: "pause",
  //           },
  //         },
  //       });

  //   res.status(200).json(subscription);
  //   // res.status(200).json({ status: "trialing" });
  // } catch (err) {
  //   res.status(err).send(err);
  // }
}
