const Account = require("../models/Account");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccountNumber } = require("../utils/gen-account");

const createNewUser = async (req, res) => {
  const {
    fullname,
    username,
    password,
    email,
    address,
    account_type,
    phone,
    gender,
    dob,
  } = req.body;

  if (
    !username ||
    !password ||
    !fullname ||
    !email ||
    !phone ||
    !address ||
    !account_type ||
    !gender ||
    !dob
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const em = email.toLowerCase();
    const uname = username.toLowerCase();

    const duplicateUser = await User.findOne({ email: em }).exec();

    if (duplicateUser)
      return res.status(409).json({ message: "User already exists" });

    let newUser;
    let newAccount;
    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create a new user object
    newUser = new User({
      username: uname,
      password: hashedPwd,
      email: em,
      fullname: fullname,
      address: address,
      phone: phone,
      dob: dob,
      gender: gender,
      account_type: account_type,
      account_no: generateAccountNumber(),
      refresh_token: null,
    });

    newAccount = new Account({
      account_owner: newUser._id,
      account_num: newUser.account_no,
      account_type: newUser.account_type,
    });

    const session = await User.startSession();
    session.startTransaction();

    await newUser.save({ session });
    await newAccount.save({ session });

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
