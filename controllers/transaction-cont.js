const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  const userId = req.userId;
  try {
    const userTransactions = await Transaction.find({ initiator: userId });

    res.status(200).json({ userTransactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewTransaction = async (req, res) => {
  const { description, amount, account, date, type } = req.body;

  if (!amount || !account || !date || !type)
    return res.status(400).json({ message: "Invalid transaction data!" });

  try {
    const receiverAccount = await Account.findOne({ account_num: account });
    if (!receiverAccount)
      return res.status(404).json({ message: "Invalid reciever account!" });
    const amt = parseFloat(amount);

    const newTransaction = {
      owner: receiverAccount.account_owner,
      amount: amt,
      desc: description,
      date: date,
      trx_type: type,
      accountNum: receiverAccount.account_num,
    };

    await Transaction.create(newTransaction);

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
    const trans = await Transaction.findById(id);
    if (!trans) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const acctNumber = trans.accountNum;
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
