const express = require("express");

const {
  getAllAccounts,
  createNewAccount,
  getUserAccount,
} = require("../controllers/account-cont");

const router = express.Router();

router.route("/").get(getAllAccounts).post(createNewAccount);

router.route("/:userId").get(getUserAccount);

module.exports = router;
