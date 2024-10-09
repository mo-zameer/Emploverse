import nodeMailer from "nodemailer"; //used to send mails

export const sendEmail = async ({ email, subject, message }) => { //email is emailId, 
  const transporter = nodeMailer.createTransport({ //transports mail
    host: process.env.SMTP_HOST, //SMTP=simple mail transfer protocol
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL, //user mail
      pass: process.env.SMTP_PASSWORD, //password
    },
  });

  const options = {
    from: process.env.SMTP_MAIL,
    to: email, //to field
    subject: subject, //sub
    text: message, //body
  };

  await transporter.sendMail(options); //sendMail will send the mail
};