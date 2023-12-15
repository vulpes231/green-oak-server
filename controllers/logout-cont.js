const User = require("../models/User");

const fsPromises = require("fs").promises;
const path = require("path");

const handleUserLogout = async (req, res) => {
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

module.exports = {
  handleUserLogout,
};
