const Account = require("../models/Account");
const User = require("../models/User");

const { generateAccountNumber } = require("../utils/gen-account");

const getAllAccounts = async (req, res) => {
  const accounts = await Account.find();
  res.status(200).json(accounts);
};

const createNewAccount = async (req, res) => {
  const { username, account_type, account_num } = req.body;

  if (!username || !account_type || !account_num) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ username }).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const duplicate = await Account.findOne({ account_num: account_num }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Account already exists!" });
  } else {
    try {
      const account_num = generateAccountNumber();
      const newAccount = {
        account_owner: username,
        account_num: account_num,
        account_type: account_type,
        available_bal: parseFloat(0).toFixed(2),
        current_bal: parseFloat(0).toFixed(2),
      };
      const result = await Account.create(newAccount);
      console.log(result);
      res.status(201).json({ message: "New account created!" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const getUserAccount = (req, res) => {
  const { username } = req.params;

  const user = accountsDB.accounts.filter(
    (acct) => acct.account_owner === username
  );
  if (!user) return res.status(400).json({ message: "Invalid user!" });
  res.status(200).json(user);
};

module.exports = { createNewAccount, getAllAccounts, getUserAccount };
