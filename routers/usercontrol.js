const express = require("express");
const {
  getAllUsers,
  deleteUser,
  getUserInfo,
  editUserInfo,
} = require("../controllers/manageuser-cont");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:userId").get(getUserInfo).delete(deleteUser).put(editUserInfo);

module.exports = router;
