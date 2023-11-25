const express = require("express");
const { changeUserPassword } = require("../controllers/change-pass");

const router = express.Router();

router.route("/:id").put(changeUserPassword);

module.exports = router;
