const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Invalid credentials!" });

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
    return res.status(400).json({ message: "Invalid credntials!" });

  try {
    const user = await Admin.findOne({ username });

    if (!user) return res.status(400).json({ message: "User does not exist!" });

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch)
      return res.status(401).json({ message: "Invalid username OR password!" });

    const accessToken = jwt.sign(
      {
        username: user.username,
        adminId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      {
        username: user.username,
        adminId: user._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "3d",
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

const logoutAdmin = async (req, res) => {
  try {
    const user = await Admin.findOne({ refreshToken: req.cookies.jwt });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while logging out." });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  createAdmin,
};
