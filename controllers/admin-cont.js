const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Invalid request!" });

  try {
    const duplicateUser = await Admin.findOne({ username });

    if (duplicateUser)
      return res.status(409).json({ message: "User already exists!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      username: username,
      password: hashPassword,
      refreshToken: null,
    });

    // console.log(newAdmin);

    res
      .status(201)
      .json({ message: `New Admin ${username} created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured!" });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Invalid request!" });

  try {
    const user = await Admin.findOne({ username });

    if (!user) return res.status(400).json({ message: "User does not exist!" });

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch)
      return res.status(401).json({ message: "Invalid username OR password!" });

    const accessToken = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured." });
  }
};

const logoutAdmin = async (req, res) => {};

module.exports = {
  loginAdmin,
  logoutAdmin,
  createAdmin,
};
