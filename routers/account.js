const express = require("express");

const {
  getAllAccounts,
  createNewAccount,
  getUserAccount,
  updateBalance,
} = require("../controllers/account-cont");

const router = express.Router();

router
  .route("/admin")
  .get(getAllAccounts)
  .post(createNewAccount)
  .put(updateBalance);

router.route("/").get(getUserAccount);

module.exports = router;
