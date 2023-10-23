const bcrypt = require("bcryptjs");
const User = require("../models/User");

const changeUserPassword = async (req, res) => {
  const { username, password, new_pass, confirm } = req.body;

  if (!password)
    return res.status(400).json({ message: "Enter a valid password" });

  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(401).json({ message: "Invalid request!" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid username or password!" });
  } else {
    try {
      if (new_pass === confirm) {
        const hashedPwd = await bcrypt.hash(new_pass, 10);
        user.password = hashedPwd;

        await user.save();

        // Respond with a success message
        return res
          .status(200)
          .json({ message: "Password updated successfully!" });
      } else {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match!" });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the password!" });
    }
  }
};

module.exports = { changeUserPassword };
