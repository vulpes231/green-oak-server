const External = require("../models/External");

const addExternalAccount = async (req, res) => {
  const userId = req.userId;

  const { account, routing, nick, type } = req.body;
  if (!account || !routing || !type)
    return res.status(400).json({ message: "Bad request!" });

  const duplicate = await External.findOne({ account });
  if (duplicate)
    return res.status(409).json({ message: "Account already exists!" });

  try {
    const newExtAccount = new External({
      owner: userId,
      account: account,
      routing: routing,
      nick: nick || null,
      type: type,
    });

    newExtAccount.save();

    res.status(201).json({ message: "External account added successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).status({ message: "An error occured!" });
  }
};

const getUserExternalAccounts = async (req, res) => {
  const userId = req.userId;
  try {
    const externalAccounts = await External.find({ owner: userId });
    res.status(200).json({ externalAccounts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured!" });
  }
};

module.exports = { addExternalAccount, getUserExternalAccounts };
