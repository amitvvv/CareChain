const nodemailer = require("nodemailer");

// Sends token by email for password reset
function sendEmail(to, message) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "supp.carechain@gmail.com",
            pass: "hrut ejwa qwpq ldne"
        }
    });

    const mailOptions = {
        from: "supp.carechain@gmail.com",
        to,
        subject: "Password Reset Token",
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
    });
}

module.exports = { sendEmail };