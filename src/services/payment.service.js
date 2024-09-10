import Stripe from "stripe";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";
import { PaymentInfo } from "../models/index.js";
import { getCurrentDateTime } from "../helpers/date.js";
import sendEmail from "../utils/sendMail.js";
import HostAwayClient from "../clients/hostaway.js";

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
        logger.info("[PaymentService][getPaymentIntentInfo] Retrieved payment intent", paymentIntentData);
        return paymentIntentData;
    } catch (error) {
        logger.error("[PaymentService][getPaymentIntentInfo] Error fetching payment intent", error);
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
            logger.info("[PaymentService][createCustomer] Customer already exists with the same email address...");
            logger.info("[PaymentService][createCustomer] Updating customer details...");

            const customer = await stripe.customers.update(existingCustomer.id, {
                name: `${firstName} ${lastName}`,
                email: email,
                phone: phone
            });

            logger.info("[PaymentService][createCustomer] Customer detail updated", customer);
            return existingCustomer.id;
        }

        // create a new customer if not found
        logger.info("[PaymentService][createCustomer] Creating new customer...");
        const customer = await stripe.customers.create({
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone
        });

        logger.info(`[PaymentService][createCustomer] CustomerID: ${customer.id}`);
        logger.info("[PaymentService][createCustomer] Customer created", customer);

        return customer.id;
    } catch (error) {
        logger.error("[PaymentService][createCustomer] Error creating customer", error);
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
    const { paymentStatus, paymentIntentId, chargeId, } = requestObj;
    const paymentInfo = await PaymentInfo.update({ paymentStatus, chargeId }, { where: { paymentIntentId } });
    logger.info(`[PaymentService][updatePaymentStatus] Payment status of PaymentIntentId: ${paymentIntentId} updated to ${paymentStatus} in the db.`);

    return paymentInfo;
};

const updateReservationId = async (reservationId, id) => {
    const paymentInfo = await PaymentInfo.update({ reservationId }, { where: { id: id } });
    logger.info(`[PaymentService][updateReservationId] ReservationId updated with ${reservationId} in the db. `);
    return paymentInfo;
}

const handleWebhookResponses = async (req) => {
    try {
        logger.info(`[PaymentService][handleWebhookResponses] Initiating webhook response handler...`);

        const sig = req.headers['stripe-signature'];
        const endpointSecret = config.STRIPE_WEBHOOK_SECRET_KEY;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            logger.error(`[PaymentService][handleWebhookResponses] Error verifying webhook signature: ${err.message}`);
            throw err;
        }

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;


        switch (event.type) {
            case 'payment_intent.created':
                logger.info(`[PaymentService][handleWebhookResponses] PaymentIntent ${paymentIntentId} was created`);
                break;
            case 'payment_intent.requires_action':
            case 'payment_intent.payment_failed':
            case 'payment_intent.processing':
            case 'payment_intent.canceled':
            case 'payment_intent.partially_funded':
            case 'amount_capturable_updated':
            case 'payment_intent.succeeded':
                {
                    logger.info(`[PaymentService][handleWebhookResponses] PaymentIntent ${paymentIntentId} got event type ${event.type}`);
                    logger.info(`[PaymentService][handleWebhookResponses] ${event}`);
                    logger.info(`[PaymentService][handleWebhookResponses] updating payment status...`);
        
                    await updatePaymentStatus({
                        paymentStatus: paymentIntent.status,
                        paymentIntentId: paymentIntentId,
                        chargeId: paymentIntent.latest_charge,
                    });

                    if (paymentIntent.status =="succeeded"){
                        const paymentInfo = await PaymentInfo.findOne({ where: { paymentIntentId } });
                        
                        //create hostaway reservation
                        const reservation = await HostAwayClient.createHostawayReservation(paymentInfo);
                        logger.info(`[PaymentService][handleWebhookResponses] Hostaway reservation created for PaymentIntent ${paymentIntentId}`);
                        logger.info(`[PaymentService][handleWebhookResponses] Reservation object: ${JSON.stringify(reservation)}`);

                        await updateReservationId(reservation?.id, paymentInfo.id);

                        //send success email to the host admin
                        await sendSuccessPaymentMail(paymentInfo, reservation?.id, reservation?.reservationDate);
                    }

                    break;
                }
            default:
                logger.info(`[PaymentService][handleWebhookResponses] Unhandled event type ${event.type} for PaymentIntent ${paymentIntentId}`);
        }
    } catch (error) {
        logger.error("[PaymentService][handleWebhookResponses] Error handling webhook response", error);
        throw error;
    }
}

const sendSuccessPaymentMail = async (paymentInfo, reservationId, reservationDate) => {
    const { guestName, guestEmail,guestPhone, listingId, checkInDate, checkOutDate, guests,
        customerId, paymentMethod, amount, currency, paymentStatus, createdAt, paymentIntentId } = paymentInfo;

    const subject = "New Booking Payment from luxurylodgingpm.co";
    const html = `
        <html>
    <head>
        <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                color: #333333;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                background-color: #ffffff;
                margin: 0 auto;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            h2 {
                color: #007bff;
                font-size: 26px;
                margin-bottom: 20px;
                text-align: center;
                letter-spacing: 1px;
            }
            p {
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 15px;
            }
            .details {
                background-color: #f1f1f1;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 5px solid #007bff;
                animation: fadeIn 0.5s ease-in;
            }
            .details p {
                margin: 12px 0;
                font-size: 15px;
                color: #555555;
            }
            .details p strong {
                color: #333333;
            }
            .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 13px;
                color: #888888;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 50px;
                font-size: 16px;
                font-weight: bold;
                letter-spacing: 0.5px;
                margin-top: 25px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #0056b3;
            }
            h3 {
                color: #007bff;
                font-size: 20px;
                margin-bottom: 10px;
                border-bottom: 2px solid #007bff;
                padding-bottom: 5px;
            }
            .fadeIn {
                animation: fadeIn 0.5s ease-in;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>New Booking Payment Confirmation</h2>
            <p>We have received a new booking payment through <strong><a href="https://luxurylodgingpm.co/">luxurylodgingpm.co</a></strong>. Please find the details below:</p>

            <div class="details fadeIn">
                <p><strong>Guest Name:</strong> ${guestName}</p>
                <p><strong>Email:</strong> ${guestEmail}</p>
                <p><strong>Phone:</strong> ${guestPhone}</p>
                <p><strong>Listing ID:</strong> ${listingId}</p>
                <p><strong>Check-In Date:</strong> ${checkInDate}</p>
                <p><strong>Check-Out Date:</strong> ${checkOutDate}</p>
                <p><strong>Number of Guests:</strong> ${guests}</p>
                <p><strong>Booking Id:</strong> ${reservationId || ''}</p>
                <p><strong>Booking Date:</strong> ${reservationDate || ''}</p>
            </div>

            <h3>Payment Information</h3>
            <div class="details fadeIn">
                <p><strong>Payment Intent ID:</strong> ${paymentIntentId}</p>
                <p><strong>Customer ID:</strong> ${customerId}</p>
                <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                <p><strong>Amount:</strong> ${parseFloat(amount) / 100} ${currency.toUpperCase()}</p>
                <p><strong>Payment Status:</strong> ${paymentStatus}</p>
                <p><strong>Payment Date:</strong> ${createdAt}</p>
            </div>


            <div class="footer">
                <p>This email was automatically generated. Please do not reply.</p>
                <p><a href="https://luxurylodgingpm.co/">luxurylodgingpm.co</a></p>
            </div>
        </div>
    </body>
    </html>
`;

    await sendEmail(subject, html);
    return true;
}

const getChargeInfo = async (paymentIntenId) => {

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