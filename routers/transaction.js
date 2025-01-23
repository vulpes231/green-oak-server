const express = require("express");

const {
  createNewTransaction,
  getUserTransactions,
  getAllTransactions,
  deleteTransactions,
} = require("../controllers/transaction-cont");

const router = express.Router();

router.route("/admin").get(getAllTransactions).post(createNewTransaction);

router.route("/").get(getUserTransactions);

router.route("/:id").delete(deleteTransactions);

module.exports = router;
