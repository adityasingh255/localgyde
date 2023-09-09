// twilioConfig.js
const twilio = require("twilio");

const accountSid = "ACCOUNT_SID";
const authToken = "AUTH_TOKEN";

const client = new twilio(accountSid, authToken);

module.exports = client;
