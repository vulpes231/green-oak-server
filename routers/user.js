const express = require("express");
const {
  getAllUsers,
  updateUser,
  getUser,
} = require("../controllers/users-cont");
const router = express.Router();

router.route("/all").get(getAllUsers);
router.route("/").get(getUser).put(updateUser);

module.exports = router;
