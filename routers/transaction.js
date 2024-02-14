const express = require("express");

const {
  createNewTransaction,
  getUserTransactions,
  getAllTransactions,
  deleteTransactions,
} = require("../controllers/transaction-cont");

const router = express.Router();

router.route("/").get(getAllTransactions).post(createNewTransaction);

router.route("/:username").get(getUserTransactions);

router.route("/delete/:id").delete(deleteTransactions);

module.exports = router;
