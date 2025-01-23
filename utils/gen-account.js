const generateRandom7Digits = () => {
  const min = 1000000; // Smallest 7-digit number (10^6)
  const max = 9999999; // Largest 7-digit number (10^7 - 1)
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

const generateAccountNumber = () => {
  const random7Digits = generateRandom7Digits();
  return "056" + random7Digits;
};

const generateOTP = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  let otp = "";

  // Generate a 6-digit OTP
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length); // Get random index from the numbers array
    otp += numbers[randomIndex]; // Append the random digit to OTP
  }

  return otp;
};

module.exports = { generateAccountNumber, generateOTP };
