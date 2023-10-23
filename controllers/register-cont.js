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

  let newUser;
  let newAccount;

  try {
    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create a new user object
    newUser = new User({
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
    });

    // Create a new account for the user
    newAccount = new Account({
      account_owner: newUser._id, // Use the _id of the user document
      account_num: newUser.account_no,
      account_type: newUser.account_type,
      available_bal: 0, // Use integers or fixed-point decimals for monetary values
      current_bal: 0, // Use integers or fixed-point decimals for monetary values
    });

    // Start a session for the transaction
    const session = await User.startSession();
    session.startTransaction();

    // Save the user
    await newUser.save({ session });

    // Save the account
    await newAccount.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: `New User ${username} created!` });
  } catch (err) {
    if (newUser) {
      // If user creation was attempted, delete the user to roll back the transaction
      await newUser.deleteOne();
    }
    if (newAccount) {
      // If account creation was attempted, delete the account to roll back the transaction
      await newAccount.deleteOne();
    }

    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNewUser };
