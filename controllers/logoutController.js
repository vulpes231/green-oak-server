const User = require("../models/User");

const logoutUser = async (req, res) => {
	const userId = req.userId;
	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found!" });

		user.refresh_token = null;
		await user.save();
		res.status(200).json({ message: "Logout successful!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { logoutUser };
