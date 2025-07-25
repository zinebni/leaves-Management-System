import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
    
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
})

// config handlebars
transporter.use(
  "compile", // compile est pour dire que c'est un moteur de template
  
  hbs({
    viewEngine: {
      partialsDir: path.resolve("./emails/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./emails/templates"),
    extName: ".hbs",
  })
);
//test de l'envoi d'email
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;