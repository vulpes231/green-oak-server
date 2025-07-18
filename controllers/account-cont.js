const Account = require("../models/Account");
const User = require("../models/User");

const { generateAccountNumber } = require("../utils/gen-account");

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ accounts });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

const createNewAccount = async (req, res) => {
  const { username, account_type, balance } = req.body;

  if (!username || !account_type)
    return res.status(400).json({ message: "All fields required" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const existingAccountsCount = await Account.countDocuments({
      account_owner: user._id,
    });
    if (existingAccountsCount >= 3) {
      return res.status(400).json({
        message: "User has reached the maximum allowed accounts (3).",
      });
    }

    const account_num = generateAccountNumber();
    const newAccount = {
      account_owner: user._id,
      account_num: account_num,
      account_type: account_type,
      available_bal: balance || 0,
      current_bal: 0,
    };

    await Account.create(newAccount);

    res.status(201).json({ message: "New account created!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserAccount = async (req, res) => {
  const userId = req.userId;

  try {
    const accounts = await Account.find({ account_owner: userId });

    res.status(200).json({ accounts });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user accounts" });
  }
};

const updateBalance = async (req, res) => {
  const { account_num, amount } = req.body;

  if (!account_num || !amount)
    return res.status(400).json({ message: "All fields required" });

  try {
    const account = await Account.findOne({ account_num });
    if (!account)
      return res.status(404).json({ message: "Account not found!" });

    account.current_bal += amount;
    account.available_bal += amount;

    await account.save();

    res.status(200).json({ message: "Account balance updated!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createNewAccount,
  getAllAccounts,
  getUserAccount,
  updateBalance,
};
