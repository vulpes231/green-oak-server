const Account = require("../models/Account");
const User = require("../models/User");

const { generateAccountNumber } = require("../utils/gen-account");

const getAllAccounts = async (req, res) => {
  const accounts = await Account.find();
  res.status(200).json(accounts);
};

const createNewAccount = async (req, res) => {
  const { username, account_type } = req.body;

  if (!username || !account_type || !account_num) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  // Check the number of existing accounts for the user
  const existingAccountsCount = await Account.countDocuments({
    account_owner: user._id,
  });

  if (existingAccountsCount >= 3) {
    return res
      .status(400)
      .json({ message: "User has reached the maximum allowed accounts (3)." });
  }

  const duplicateAccount = await Account.findOne({ account_num }).exec();

  if (duplicateAccount) {
    return res.status(409).json({ message: "Account already exists!" });
  } else {
    try {
      const account_num = generateAccountNumber();
      const newAccount = {
        account_owner: user._id, // Assuming user._id is the reference to the user
        account_num: account_num, // Use the provided account number
        account_type: account_type,
        available_bal: 0, // Use integers or fixed-point decimals for monetary values
        current_bal: 0, // Use integers or fixed-point decimals for monetary values
      };
      const result = await Account.create(newAccount);
      console.log(result);
      res.status(201).json({ message: "New account created!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const getUserAccount = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  // Assuming you have a Mongoose model named 'Account'
  try {
    const userAccounts = await Account.find({ account_owner: userId }); // Find all accounts with the given username
    if (!userAccounts || userAccounts.length === 0) {
      return res
        .status(400)
        .json({ message: "No accounts found for the user!" });
    }
    res.status(200).json(userAccounts);
  } catch (error) {
    // Handle any potential errors from the database
    console.error("Error retrieving user accounts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createNewAccount, getAllAccounts, getUserAccount };
