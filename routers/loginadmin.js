const express = require("express");
const { loginAdmin } = require("../controllers/admin-cont");

const router = express.Router();

router.route("/").post(loginAdmin);

module.exports = router;
