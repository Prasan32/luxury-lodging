import Stripe from "stripe";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";

const stripe = Stripe(config.STRIPE_SECRET_KEY);

const createPaymentIntent = async (requestObj) => {
    const { listingId, checkIn, checkOut, guests, amount, currency } = requestObj;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            description: `Payment Intent for booking listing:${listingId} [${checkIn}-${checkOut}][${guests}]`,
            metadata: {
                listingId,
                checkIn,
                checkOut,
                guests
            }
        });

        logger.info("Created payment intent", paymentIntent);
        logger.info(paymentIntent.id);

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        logger.error("Error creating payment intent", error);
        throw error;
    }
};

const createCustomer = async (requestObj) => {
    const { firstName, lastName, email, phone } = requestObj;
    try {
        //check if the customer is already registered with the same email address
        const response = await stripe.customers.list({ email: email });
        const existingCustomer = response.data.find(c => c.email === email);
        
        if (existingCustomer) {
            logger.info("Updating customer details");
            await stripe.customers.update(existingCustomer.id, {
                name: `${firstName} ${lastName}`,
                email: email,
                phone: phone
            });

            return existingCustomer.id;
        }

        // create a new customer if not found
        logger.info("Creating new customer");
        const customer = await stripe.customers.create({
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone
        });

        logger.info("Created customer", customer);
        logger.info(customer.id);
        return customer.id;
    } catch (error) {
        logger.error("Error creating customer", error);
        throw error;
    }
}

const paymentServices = {
    createPaymentIntent,
    createCustomer
};

export default paymentServices;