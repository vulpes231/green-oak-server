const { generateOTP } = require("../utils/gen-account");
const { sendMail } = require("../utils/mailer");

const emailUser = async (req, res) => {
  const { email, subject, message } = req.body;
  try {
    await sendMail(email, subject, message);
    res.status(200).json({ message: "Mail sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending mail!" });
  }
};

const sendLoginCode = async (req, res) => {
  const { email } = req.body;

  console.log(email);
  try {
    const subject = "RegentOak Bank - Your Login Code";
    const code = generateOTP();
    const message = `
        <h3>Dear Valued Customer,</h3>
  
        <p>We received a request to log into your RegentOak Bank account. Your one-time login code is:</p>
        
        <h2 style="font-weight: bold; color: #1e73be;">${code}</h2>
        
        <p>Please note:</p>
        <ul>
          <li>Do not share this code with anyone.</li>
          <li>The code is valid for a limited time only.</li>
        </ul>
  
        <p>If you did not request this code, please disregard this message.</p>
  
        <p>If you have any concerns, please contact our support team immediately.</p>
  
        <br />
        <small style="color: #888;">This is an automated message. Please do not reply.</small><br />
        <small style="color: #888;">RegentOak Bank</small>
      `;
    await sendMail(email, subject, message);
    res.status(200).json({ message: "Mail sent successfully.", otp: code });
  } catch (error) {
    res.status(500).json({ message: "Error sending mail!" });
  }
};

module.exports = { emailUser, sendLoginCode };
