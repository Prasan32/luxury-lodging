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

const paymentServices = {
    createPaymentIntent
};

export default paymentServices;