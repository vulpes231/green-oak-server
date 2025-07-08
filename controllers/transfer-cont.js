const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const { format, parseISO } = require("date-fns");

const transferMoney = async (req, res) => {
	const userId = req.userId;
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

		if (senderBalance < amount)
			return res.status(400).json({ message: "Insufficient funds!" });

		senderBalance = senderAcct.available_bal -= amt;
		// receiverBalance = receiverBalance += amt;

		await senderAcct.save();

		const newTransaction = new Transaction({
			owner: userId,
			sender: from,
			receiver: to,
			amount: amt,
			desc: memo || "External Transfer",
			date: myDate,
			trx_type: "debit",
		});

		await newTransaction.save();

		res.status(200).json({ message: "Transfer Successful" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "An error occured." });
	}
};

module.exports = { transferMoney };
