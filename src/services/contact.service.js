import sendEmail from "../utils/sendMail.js";

const processContactSubmission = async (fullname, email, phoneNumber, description) => {

    const subject = "New contact form submission";
    const html = `
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>New Contact Form Submission</h2>
                <p><strong>Full Name:</strong> ${fullname}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Description:</strong><br>${description}</p>
                <hr>
                <p style="font-size: 0.9em; color: #555;">This email was generated from the contact form on your website.</p>
            </body>
            </html>
        `;


    await sendEmail(subject, html);
    return true;
};

const contactServices = {
    processContactSubmission
};

export default contactServices;