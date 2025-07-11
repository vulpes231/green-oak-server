const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ message: "Bad request!" });
	}

	try {
		const user = await User.findOne({ username: username.toLowerCase() });
		if (!user) {
			return res.status(401).json({ message: "User does not exist!" });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: "Invalid username OR password!" });
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
	} catch (error) {
		res.status(500).json({ message: "Error logging in user!" });
	}
};

module.exports = loginUser;
