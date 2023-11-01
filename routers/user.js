const express = require("express");
const {
  getAllUsers,
  updateUser,
  getUser,
} = require("../controllers/users-cont");
const router = express.Router();

router.route("/").get(getAllUsers).put(updateUser);
router.route("/:id").get(getUser);

module.exports = router;
