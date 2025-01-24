const express = require("express");
const { handleUserLogout } = require("../controllers/logout-cont");
const router = express.Router();

router.route("/").put(handleUserLogout);

module.exports = router;
