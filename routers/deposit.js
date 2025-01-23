const express = require("express");
const { depositCheck } = require("../controllers/deposit-controller");
const router = express.Router();

router.route("/").post(depositCheck);

module.exports = router;
