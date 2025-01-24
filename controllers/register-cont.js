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

  const session = await User.startSession(); // Start a session for transaction

  try {
    session.startTransaction(); // Begin transaction

    const em = email.toLowerCase();
    const uname = username.toLowerCase();

    // Check if the email already exists
    const duplicateUser = await User.findOne({ email: em })
      .session(session)
      .exec();
    if (duplicateUser) {
      await session.abortTransaction(); // Rollback the transaction
      return res.status(409).json({ message: "User already exists" });
    }

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

    const createdUser = await User.create([newUser], { session });

    const newAccount = {
      account_type: account_type,
      account_num: generateAccountNumber(),
      account_owner: createdUser[0]._id,
    };

    await Account.create([newAccount], { session });

    await session.commitTransaction();

    res.status(201).json({ message: `New User ${username} created!` });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

module.exports = { createNewUser };
