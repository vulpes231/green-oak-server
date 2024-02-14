const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const User = require("../models/User");

const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.status(200).json(transactions);
};

const getUserTransactions = async (req, res) => {
  const { username } = req.params;
  console.log(`acct ${username}`);
  if (!username) return res.status(400).json({ message: "Invalid userId!" });
  const userTransactions = await Transaction.find({ initiator: username });

  if (!userTransactions || userTransactions.length === 0) {
    return res
      .status(400)
      .json({ message: "No transactions found for the user!" });
  }
  res.status(200).json(userTransactions);
};

const createNewTransaction = async (req, res) => {
  const { initiator, description, amount, account, date, sender, type } =
    req.body;

  console.log("req", req.body);

  if (
    !initiator ||
    !sender ||
    !description ||
    !amount ||
    !account ||
    !date ||
    !type
  )
    return res.status(400).json({ message: "Invalid transaction data!" });

  const receiver = await Account.findOne({ account_num: account });

  if (!receiver)
    return res.status(404).json({ message: "Invalid receiver account!" });

  const amt = parseFloat(amount).toFixed(2);

  try {
    const newTransaction = {
      initiator: initiator,
      sender: sender,
      receiver: account,
      amount: amt,
      desc: description,
      date: date,
      trx_type: type,
    };

    let floatBal;

    floatBal = parseFloat(receiver.available_bal).toFixed(2);
    console.log(floatBal);

    if (type === "credit") {
      floatBal = (parseFloat(floatBal) + parseFloat(amt)).toFixed(2);
      console.log(floatBal);
      receiver.available_bal = floatBal;
    } else if (type === "debit") {
      floatBal = (parseFloat(floatBal) - parseFloat(amt)).toFixed(2);
      console.log(floatBal);
      receiver.available_bal = floatBal;
    }

    // console.log(sum);
    await receiver.save();

    await Transaction.create(newTransaction);
    console.log(receiver.available_bal);
    res.status(201).json({ message: "Transaction created successfully!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating a transaction!" });
  }
};

const deleteTransactions = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the transaction by ID
    const trans = await Transaction.findById(id);
    if (!trans) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const acctNumber = trans.receiver;
    const amount = trans.amount;

    // Find the account associated with the transaction
    const account = await Account.findOne({ account_num: acctNumber });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Update the available balance
    account.available_bal -= amount;

    // Save the updated account
    await account.save();

    // Delete the transaction
    await trans.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createNewTransaction,
  getUserTransactions,
  getAllTransactions,
  deleteTransactions,
};
