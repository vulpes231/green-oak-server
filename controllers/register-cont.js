const Account = require("../models/Account");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccountNumber } = require("../utils/gen-account");

const createNewUser = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    password,
    email,
    address,
    account_type,
    phone,
  } = req.body;

  if (
    !username ||
    !password ||
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !address ||
    !account_type
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "User already exists!" });
  }

  try {
    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      username: username,
      password: hashedPwd,
      email: email,
      firstname: firstname,
      lastname: lastname,
      address: address,
      phone: phone,
      account_type: account_type,
      account_no: generateAccountNumber(),
      refresh_token: null, // Handle refresh tokens separately
    };

    // Create a new account for the user
    const newAccount = {
      account_owner: newUser.username,
      account_num: newUser.account_no,
      account_type: newUser.account_type,
      available_bal: 0, // Use integers or fixed-point decimals for monetary values
      current_bal: 0, // Use integers or fixed-point decimals for monetary values
    };

    // Save the user and account
    const userSave = await User.create(newUser);
    const acctSave = await Account.create(newAccount);

    console.log(userSave);
    console.log(acctSave);

    res.status(201).json({ message: `New User ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNewUser };
