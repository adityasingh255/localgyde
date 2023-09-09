// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const twilioClient = require("./twilioConfig");
const User = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("MONGODB_URI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await User.findOne({ mobileNumber: phoneNumber });

    if (!user) {
      const otp = generateOTP();
      user = new User({ mobileNumber: phoneNumber, otp });
      await user.save();
    }

    await sendOTPviaSMS(phoneNumber, user.otp);

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPviaSMS(phoneNumber, otp) {
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      from: "+12568183690",
      to: phoneNumber,
    });
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

app.post("/verify", async (req, res) => {
  const { phoneNumber, verificationCode } = await req.body;

  try {
    const user = await User.findOne({ mobileNumber: phoneNumber });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== verificationCode) {
      return res.status(401).json({ error: "Invalid OTP!" });
    }
    const currentTime = new Date();
    const otpExpirationTime = new Date(user.otpExpiration);

    if (currentTime > otpExpirationTime) {
      return res.status(401).json({ error: "OTP has expired!" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
