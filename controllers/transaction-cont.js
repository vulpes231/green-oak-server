const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.status(200).json(transactions);
};

const getUserTransactions = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "User not found!" });
  const userTransactions = await Transaction.find({ _id: id });

  if (!userTransactions || userTransactions.length === 0) {
    return res.status(400).json({ message: "No accounts found for the user!" });
  }
  res.status(200).json(userTransactions);
};

const createNewTransaction = async (req, res) => {
  const { description, amount, account, date, sender } = req.body;

  if (!sender || !description || !amount || !account || !date)
    return res.status(400).json({ message: "Invalid transaction data!" });

  const receiver = await Account.findOne({ account_num: account });

  if (!receiver)
    return res.status(404).json({ message: "Invalid receiver account!" });

  try {
    const newTransaction = {
      sender: sender,
      receiver: account,
      amount: amount,
      desc: description,
      date: date,
    };

    receiver.available_bal += amount;
    await receiver.save();

    const transaction = await Transaction.create(newTransaction);
    console.log(transaction);
    res.status(201).json({ message: "Transaction created successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while creating transaction!" });
  }
};

const deleteTransactions = (req, res) => {};

module.exports = {
  createNewTransaction,
  getUserTransactions,
  getAllTransactions,
};
