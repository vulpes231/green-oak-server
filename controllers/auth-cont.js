const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  const uname = username.toLowerCase();
  const user = await User.findOne({ username: uname });
  if (!user) {
    return res.status(401).json({ message: "Username does not exist!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid username or password!" });
  }

  const accessToken = jwt.sign(
    {
      username: user.username,
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    {
      username: user.username,
      userId: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "3d",
    }
  );

  // Here, you can choose to update the user with the new refreshToken
  user.refresh_token = refreshToken;
  await user.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  const email = user.email;

  res.status(200).json({ accessToken, username, email });
};

module.exports = loginUser;
