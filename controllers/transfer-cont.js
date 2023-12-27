const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

const transferMoney = async (req, res) => {
  const { from, to, amount, memo } = req.body;

  if (!from || !to || !amount)
    return res.status(400).json("Invalid transfer details");

  const amt = parseFloat(amount);

  try {
    const senderAcct = await Account.findOne({ account_num: from });
    if (!senderAcct) return res.status(404).json("Invalid sender account!");

    let senderBalance = parseFloat(senderAcct.available_bal);

    const receiverAcct = await Account.findOne({ account_num: to });
    if (!receiverAcct) return res.status(404).json("Invalid receiver account!");

    let receiverBalance = parseFloat(receiverAcct.available_bal);

    if (senderBalance < amount)
      return res.status(400).json("Insufficient funds!");

    //   update the accounts appropriately
    senderBalance = senderBalance -= amt;
    receiverBalance = receiverBalance += amt;

    await senderAcct.save();
    await receiverAcct.save();

    const newTransaction = new Transaction({
      sender: from,
      receiver: to,
      amount: amount,
      desc: memo || null,
      date: new Date(),
    });

    await newTransaction.save();

    res.status(200).json({ message: "Transfer Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { transferMoney };
