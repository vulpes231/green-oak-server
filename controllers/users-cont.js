const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const { id } = req.params;

  console.log(id);

  const user = await User.findOne({ _id: id }).exec();
  if (!user) return res.status(404).json({ message: "user not found" });
  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const { email, phone } = req.body;
  const { id } = req.params;

  if (!email || !phone) {
    return res.status(400).json({ message: "At least one value is required!" });
  }

  try {
    // Find the user based on their username
    const user = await User.findOne({ _id: id }).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Update the user's properties if provided
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Save the updated user document to the database
    await user.save();

    res.status(200).json({ message: `${user.username} profile updated!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getAllUsers, updateUser, getUser };
