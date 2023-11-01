const express = require("express");
const { depositCheck } = require("../controllers/deposit-controller");
const router = express.Router();

router.route("/:id").post(depositCheck);

module.exports = router;
