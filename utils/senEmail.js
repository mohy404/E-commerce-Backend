const nodemailer = require('nodemailer')

const sendEmail = async (option) => {
    // 1- create transporter service that will send email Like Gmail
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 25 ,
        // secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // Define Options 
    const mailOptions = {
        from: option.from || "admin@.com",
        to: option.email,
        subject: option.subject,
        text: option.message,
    }
    // send Email
    await transporter.sendMail(mailOptions)
}

module.exports =  sendEmail

