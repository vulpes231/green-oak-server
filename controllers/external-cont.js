const External = require("../models/External");

const addExternalAccount = async (req, res) => {
  const { account, routing, nick } = req.body;
  const user = req.user;

  console.log(req.user);

  if (!user) return res.status(401).json({ message: "Unauthorized access!" });
  if (!account || !routing)
    return res.status(400).json({ message: "Bad request!" });

  try {
    const newExtAccount = new External({
      username: user,
      account: account,
      routing: routing,
      nick: nick || null,
    });

    newExtAccount.save();

    res.status(201).json({ message: "External account added successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).status({ message: "An error occured!" });
  }
};

module.exports = { addExternalAccount };
