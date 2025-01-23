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

  console.log(id);
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

module.exports = { getAllUsers, updateUser, getUser };
