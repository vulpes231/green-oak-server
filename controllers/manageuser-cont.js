const Account = require("../models/Account");
const External = require("../models/External");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInfo = async (req, res) => {
  const { userId } = req.params;
  try {
    const userInfo = await User.findOne({ _id: userId });
    res.status(200).json({ userInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { email, phone, username } = req.body;

  if (!email || !phone || !username)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ _id: userId });
    user.email = email;
    user.phone = phone;
    user.username = username;

    await user.save();
    res.status(200).json({ message: "User updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, deleteUser, getUserInfo, editUserInfo };
