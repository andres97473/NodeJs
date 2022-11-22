const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "1066303501942-pt5c5vom8lcrqhlqcjt36kfccunlvgtn.apps.googleusercontent.com";
const CLIENT_SECRECT = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04DmeM7ASbdKqCgYIARAAGAQSNwF-L9Irwoa-EbUsxxqQj1ZnBxNZfabMI5Nuoc-8oV-aMUs1Oa4DAbOSvVhvudu_CgmDMfz1XnQ";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRECT,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendEmail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "mensajesapp4@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRECT,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "Pagina web Nodemailer <mensajesapp4@gmail.com>",
      to: "mensajesapp4@gmail.com",
      subject: "Nodemailer prueba",
      text: "Este es un mensaje de prueba nodemailer",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(result);
  } catch (error) {
    console.log("Algo no va bien con el email", error);
  }
}

const getTemplate = (name, token) => {
  return `
        <head>
            <link rel="stylesheet" href="./style.css">
        </head>
        
        <div id="email___content">
            <img src="https://i.imgur.com/eboNR82.png" alt="">
            <h2>Hola ${name}</h2>
            <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
            <a
                href="http://localhost:4000/api/user/confirm/${token}"
                target="_blank"
            >Confirmar Cuenta</a>
        </div>
      `;
};

module.exports = {
  sendEmail,
  getTemplate,
};
