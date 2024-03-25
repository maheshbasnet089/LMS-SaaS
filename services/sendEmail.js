const nodemailer = require('nodemailer')

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.MY_EMAIL,
            pass : process.env.MY_EMAIL_APP_PASSWORD
        },
    })
    const mailOptions = {
        from : process.env.MY_EMAIL,
        to : options.to,
        text : options.text,
        subject : options.subject
    }

    await transporter.sendMail(mailOptions)

}

module.exports = sendEmail