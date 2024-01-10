const express = require("express");
const { createAdmin, loginAdmin } = require("../controllers/admin-cont");

const router = express.Router();

router.route("/").post(createAdmin);
router.route("/admin").post(loginAdmin);

module.exports = router;
