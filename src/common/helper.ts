
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

var bcrypt = require('bcrypt');

export const cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });
  });
};

export const comparePassword = function(plainPass, hashword, callback) {
   bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
       return err == null ?
           callback(null, isPasswordMatch) :
           callback(err);
   });
};

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESHTOKEN,
});


export const senTMail = async (mailOptions) => {
    try {
        if (mailOptions) {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.EMAIL,
                    clientId: process.env.CLIENTID,
                    clientSecret: process.env.CLIENTSECRET,
                    refreshToken: process.env.REFRESHTOKEN,
                    accessToken: oauth2Client.getAccessToken(),
                },
            })
            let result = transporter.sendMail(mailOptions);
            return result;
        }
    } catch (error) {
        return error
    }

}


export const sub = (a,b) =>{
    return a-b;
}