const express = require("express");

const {
  getAllAccounts,
  createNewAccount,
  getUserAccount,
  updateBalance,
  updateAccountNumber,
} = require("../controllers/account-cont");

const router = express.Router();

router.route("/admin").get(getAllAccounts).post(createNewAccount);

router.route("/update").patch(updateAccountNumber).put(updateBalance);

router.route("/").get(getUserAccount);

module.exports = router;
