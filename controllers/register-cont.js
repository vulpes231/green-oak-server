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

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = {
      username: uname,
      password: hashedPwd,
      email: em,
      fullname: fullname,
      address: address,
      phone: phone,
      dob: dob,
      gender: gender,
    };
    await User.create(newUser);

    const newAccount = {
      account_type: account_type,
      account_no: generateAccountNumber(),
      account_owner: newUser._id,
    };
    await Account.create(newAccount);

    res.status(201).json({ message: `New User ${username} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNewUser };
