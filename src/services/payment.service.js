import Stripe from "stripe";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";
import { PaymentInfo } from "../models/index.js";

const stripe = Stripe(config.STRIPE_SECRET_KEY);

const createPaymentIntent = async (requestObj) => {
    const { listingId, checkIn, checkOut, guests, amount, currency } = requestObj;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card', 'us_bank_account', 'affirm'],
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

        return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
    } catch (error) {
        logger.error("Error creating payment intent", error);
        throw error;
    }
};

const getStripePublishableKey = () => {
    return config.STRIPE_PUBLISHABLE_KEY;
}

const getPaymentIntentInfo = async (paymentIntent) => {
    try {
        const paymentIntentData = await stripe.paymentIntents.retrieve(paymentIntent);
        logger.info("Retrieved payment intent", paymentIntentData);
        return paymentIntentData;
    } catch (error) {
        logger.error("Error fetching payment intent", error);
        throw error;
    }
}

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

const savePaymentInfo = async (requestObj) => {
    const {
        guestName,
        guestEmail,
        guestPhone,
        listingId,
        checkInDate,
        checkOutDate,
        guests,
        paymentIntentId,
        customerId,
        paymentMethod,
        amount,
        currency,
        paymentStatus
    } = requestObj;

    const paymentInfo = await PaymentInfo.create({
        guestName,
        guestEmail,
        guestPhone,
        listingId,
        checkInDate,
        checkOutDate,
        guests,
        paymentIntentId,
        customerId,
        paymentMethod,
        amount,
        currency,
        paymentStatus
    });

    return paymentInfo;
}

const updatePaymentStatus = async (requestObj) => {
    const { paymentStatus, paymentIntentId } = requestObj;

    const paymentInfo = await PaymentInfo.update({ paymentStatus }, { where: { paymentIntentId } });
    logger.info(`Payment status of PaymentIntentId: ${paymentIntentId} updated to ${paymentStatus}`);

    return paymentInfo;
};

const handleWebhookResponses = async (req) => {
    try {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = config.STRIPE_WEBHOOK_SECRET_KEY;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            logger.error(`Webhook Error: ${err.message}`);
            throw err;
        }

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;


        switch (event.type) {
            case 'payment_intent.created':
                console.log(`PaymentIntent ${paymentIntentId} was created`);
                break;
            case 'payment_intent.requires_action':
            case 'payment_intent.payment_failed':
            case 'payment_intent.processing':
            case 'payment_intent.canceled':
            case 'payment_intent.partially_funded':
            case 'amount_capturable_updated':
            case 'payment_intent.succeeded':
                {
                    await updatePaymentStatus({
                        paymentStatus: paymentIntent.status,
                        paymentIntentId: paymentIntentId
                    });
                    break;
                }
            default:
                console.log(`Unhandled event type ${event.type} for PaymentIntent ${paymentIntentId}`);
        }
    } catch (error) {
        logger.error("Error handling webhook response", error);
        throw error;
    }
}

const paymentServices = {
    createPaymentIntent,
    createCustomer,
    savePaymentInfo,
    getPaymentIntentInfo,
    handleWebhookResponses,
    getStripePublishableKey
};

export default paymentServices;