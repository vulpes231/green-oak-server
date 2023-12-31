const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const { format, parseISO } = require("date-fns");

const transferMoney = async (req, res) => {
  const { from, to, amount, memo, date } = req.body;

  if (!from || !to || !amount || !date)
    return res.status(400).json({ message: "Invalid transfer details" });

  try {
    const amt = parseFloat(amount);

    const currentDate = parseISO(date);
    const myDate = format(currentDate, "MM/dd/yyyy");
    const senderAcct = await Account.findOne({ account_num: from });
    if (!senderAcct)
      return res.status(404).json({ message: "Invalid sender account!" });

    let senderBalance = parseFloat(senderAcct.available_bal);
    // console.log("Before trx", senderAcct.available_bal);

    // const receiverAcct = await Account.findOne({ account_num: to });
    // if (!receiverAcct)
    //   return res.status(404).json({ message: "Invalid receiver account!" });

    // let receiverBalance = parseFloat(receiverAcct.available_bal);

    if (senderBalance < amount)
      return res.status(400).json({ message: "Insufficient funds!" });

    //   update the accounts appropriately
    senderBalance = senderAcct.available_bal -= amt;
    // receiverBalance = receiverBalance += amt;

    await senderAcct.save();
    // await receiverAcct.save();

    // console.log("After trx", senderAcct.available_bal);

    const newTransaction = new Transaction({
      initiator: req.user,
      sender: from,
      receiver: to,
      amount: amt,
      desc: memo || "External Transfer",
      date: myDate,
    });

    await newTransaction.save();

    res.status(200).json({ message: "Transfer Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured." });
  }
};

module.exports = { transferMoney };
