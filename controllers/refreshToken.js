const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const handleUserToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);
  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken }).exec();

  if (!user) return res.status(403).json({ message: "Forbidden!" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.username !== decoded.username) return res.status(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    res.status(200).json({ accessToken });
  });
};

module.exports = { handleUserToken };
