const express = require("express");
const {
  addExternalAccount,
  getUserExternalAccounts,
} = require("../controllers/external-cont");

const router = express.Router();

router.route("/").post(addExternalAccount);
router.route("/:username").get(getUserExternalAccounts);

module.exports = router;
