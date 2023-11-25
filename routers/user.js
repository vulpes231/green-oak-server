const express = require("express");
const {
  getAllUsers,
  updateUser,
  getUser,
} = require("../controllers/users-cont");
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).put(updateUser);

module.exports = router;
