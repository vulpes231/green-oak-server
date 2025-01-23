const express = require("express");
const {
  addExternalAccount,
  getUserExternalAccounts,
} = require("../controllers/external-cont");

const router = express.Router();

router.route("/").get(getUserExternalAccounts).post(addExternalAccount);

module.exports = router;
