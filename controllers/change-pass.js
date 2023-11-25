const bcrypt = require("bcryptjs");
const User = require("../models/User");

const changeUserPassword = async (req, res) => {
  const { password, new_pass } = req.body;
  const { id } = req.params;

  if (!password || !new_pass)
    return res.status(400).json({ message: "Form cannot be empty!" });

  const user = await User.findOne({ _id: id }).exec();
  if (!user) return res.status(401).json({ message: "Invalid request!" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid username or password!" });
  } else {
    try {
      const hashedPwd = await bcrypt.hash(new_pass, 10);
      user.password = hashedPwd;

      await user.save();

      // Respond with a success message
      return res
        .status(200)
        .json({ message: "Password updated successfully!" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the password!" });
    }
  }
};

module.exports = { changeUserPassword };
