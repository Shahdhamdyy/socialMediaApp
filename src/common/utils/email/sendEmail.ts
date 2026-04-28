import nodemailer from "nodemailer";
import { env } from "../../../config/env.service";
import { SendMailOptions } from "nodemailer";
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    //auth object contains the credentials for the email account you want to send from
    auth: {
        //comes from sender email account
        user: env.APP_EMAIL,
        pass: env.APP_PASSWORD,
    },
});

// Send an email using async/await

export let sendEmail = async ({
    to,
    subject,
    html,
}: SendMailOptions): Promise<void> => {

    const info = await transporter.sendMail({
        from: `"shahd hamdy" <${env.APP_EMAIL}>`,
        to,
        subject,
        html,
    });

    console.log("Message sent:", info.messageId);
};