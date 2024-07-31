import sgMail from "@sendgrid/mail";
import { config } from "../config/envConfig.js";
import logger from "../config/winstonLoggerConfig.js";

sgMail.setApiKey(config.SENDGRID_API_KEY);

const sendEmail = async (subject, html) => {
    const msg = {
        to: config.EMAIL_TO,
        from: config.EMAIL_FROM,
        subject: subject,
        html: html
    };
    try {
        await sgMail.send(msg);
        logger.info('Email sent successfully');
    } catch (error) {
        logger.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;