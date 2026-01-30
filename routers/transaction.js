const express = require("express");

const {
  createNewTransaction,
  getUserTransactions,
  getAllTransactions,
  deleteTransactions,
  reverseTransaction,
} = require("../controllers/transaction-cont");

const router = express.Router();

router.route("/admin").get(getAllTransactions).post(createNewTransaction);

router.route("/").get(getUserTransactions);

router.route("/:id").delete(deleteTransactions);
router.route("/:transactionId").patch(reverseTransaction);

module.exports = router;
