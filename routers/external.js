const express = require("express");
const { addExternalAccount } = require("../controllers/external-cont");

const router = express.Router();

router.route("/").post(addExternalAccount);

module.exports = router;
