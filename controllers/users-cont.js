const Account = require("../models/Account");
const External = require("../models/External");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const getUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refresh_token: refreshToken });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(401);
    } else {
      user.refresh_token = null;
      await user.save();

      // Clear the cookie
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      // Return a 204 status code indicating a successful logout
      return res.sendStatus(204);
    }
  } catch (error) {
    console.error("Error during token verification:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateUser, getUser, logoutUser };
