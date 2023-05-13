// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export default async function handler(req, res) {
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);
    const phone = req.body.phone;
    const tinderData = req.body.user;

    const customerResults = await stripe.customers.search({
      query: `phone: '${phone}'`,
    });

    if (!customerResults.data.length) {
      try {
        const pass = process.env.EMAIL_PASS;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "rafael.esteves.ti@gmail.com",
            pass,
          },
        });

        const mailOptions = {
          from: "rafael.esteves.ti@gmail.com",
          to: "chadbot.tinder@gmail.com",
        };

        await transporter.sendMail({
          ...mailOptions,
          subject: "CORRE! Novo lead criado no CHADBOT",
          text: `Nome: ${tinderData.user.name}, telefone: ${phone}`,
        });
      } catch (e) {
        console.log(e);
      }
    }
    const customer_fields = {
      phone: phone,
      email: tinderData.account?.account_email ?? "sem email",
      name: tinderData.user.name,
      address: {
        city: tinderData.user.city?.name ?? "sem cidade",
        state: tinderData.user.city?.region ?? "sem estado",
        country: tinderData.user.pos_info?.country?.name ?? "sem país",
      },
      metadata: {
        gender: tinderData.user.gender ?? "sem genero",
        age_filter_max: tinderData.user.age_filter_max ?? "sem filtro",
        age_filter_min: tinderData.user.age_filter_min ?? "sem filtro",
        interested_in:
          tinderData.user.interested_in?.toString() ?? "sem interesse",
        purchase: tinderData.purchase?.purchases[0]?.purchase_type,
      },
    };

    const customer = customerResults.data.length
      ? await stripe.customers.update(
          customerResults.data[0].id,
          customer_fields
        )
      : await stripe.customers.create(customer_fields);

    res.status(200).json(customer);
  } catch (err) {
    res.status(err).send(err);
  }
}
