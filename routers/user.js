const express = require("express");
const {
  updateUser,
  getUser,
  logoutUser,
} = require("../controllers/users-cont");
const router = express.Router();

router.route("/").get(getUser).put(updateUser);
router.route("/logout").post(logoutUser);

module.exports = router;
