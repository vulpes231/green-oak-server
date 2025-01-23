const { format, addDays } = require("date-fns");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");

const depositCheck = async (req, res) => {
  const { deposit_to, amount } = req.body;
  const userId = req.userId;

  if (!deposit_to || !amount)
    return res.status(400).json({ message: "Enter deposit details!" });

  const userAccount = await Account.findOne({ account_owner: userId }).exec();

  if (!userAccount)
    return res.status(404).json({ message: "Invalid user account!" });

  const getAvailableDate = addDays(new Date(), 3);
  const newDate = format(getAvailableDate, "yyyy:MM:dd");
  const depositDate = format(new Date(), "yyyy:MM:dd");

  try {
    const newDeposit = {
      depositor: userId,
      deposit_account: deposit_to,
      amount: amount,
      deposit_date: depositDate,
      available_date: newDate,
    };

    const deposit = await Deposit.create(newDeposit);

    res.status(201).json({ message: "Check deposit successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

module.exports = { depositCheck };
