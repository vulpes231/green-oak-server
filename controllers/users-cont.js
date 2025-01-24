const Account = require("../models/Account");
const External = require("../models/External");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  ß;
};

const updateUser = async (req, res) => {
  const { email, phone } = req.body;
  const userId = req.userId;

  if (!email || !phone) {
    return res.status(400).json({ message: "At least one value is required!" });
  }

  try {
    // Find the user based on their username
    const user = await User.findOne({ _id: userId }).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({ message: `${user.username} profile updated!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const session = await User.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const accounts = await Account.find({ account_owner: userId }).session(
      session
    );

    const transactions = await Transaction.find({ owner: userId }).session(
      session
    );

    const externalAccounts = await External.find({ owner: userId }).session(
      session
    );

    if (accounts.length > 0) {
      await Account.deleteMany({ account_owner: userId }).session(session);
    }

    if (transactions.length > 0) {
      await Transaction.deleteMany({ owner: userId }).session(session);
    }

    if (externalAccounts.length > 0) {
      await External.deleteMany({ owner: userId }).session(session);
    }

    await User.findByIdAndDelete(userId).session(session);

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};

module.exports = { getAllUsers, updateUser, getUser, deleteUser };
