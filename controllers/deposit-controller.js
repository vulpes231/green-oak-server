const { format, addDays } = require("date-fns");
const Account = require("../models/Account");
const Deposit = require("../models/Deposit");

const depositCheck = async (req, res) => {
  const { deposit_to, amount, date } = req.body;
  const { id } = req.params;

  if (!deposit_to || !amount || !date || !id)
    return res.status(400).json({ message: "Enter deposit details!" });

  const userAccount = await Account.findOne({ _id: id }).exec();

  if (!userAccount)
    return res.status(404).json({ message: "Invalid user account!" });

  const getAvailableDate = addDays(date, 3);
  const newDate = format(getAvailableDate, "yyyy:MM:dd");

  try {
    const newDeposit = {
      depositor: id,
      deposit_account: deposit_to,
      amount: amount,
      deposit_date: date,
      available_date: newDate,
    };

    const deposit = await Deposit.create(newDeposit);
    console.log(deposit);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
};

module.exports = { depositCheck };
