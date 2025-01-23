const express = require("express");

const {
  getAllAccounts,
  createNewAccount,
  getUserAccount,
} = require("../controllers/account-cont");

const router = express.Router();

router.route("/admin").get(getAllAccounts).post(createNewAccount);

router.route("/").get(getUserAccount);

module.exports = router;
