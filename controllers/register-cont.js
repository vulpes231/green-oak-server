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

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create a new user object
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

    // Create the user in the database
    const createdUser = await User.create([newUser], { session }); // Pass session here

    // Create a new account linked to the user
    const newAccount = {
      account_type: account_type,
      account_no: generateAccountNumber(),
      account_owner: createdUser[0]._id, // createdUser is an array, get the first user
    };

    // Create the account in the database
    await Account.create([newAccount], { session }); // Pass session here

    // Commit the transaction if everything is successful
    await session.commitTransaction();

    res.status(201).json({ message: `New User ${username} created!` });
  } catch (err) {
    // If any error occurs, abort the transaction to ensure data consistency
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    // End the session
    session.endSession();
  }
};

module.exports = { createNewUser };
