dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

const getCustomers = async () => {
  const customers = await stripe.customers.list({
    limit: 20,
  });
  console.log(
    customers.data.map((c) => {
      return {
        currency: c.currency,
        phone: c.phone,
      };
    })
  );
};

getCustomers();
