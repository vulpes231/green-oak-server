const { Router } = require("express");
const { logoutUser } = require("../controllers/logoutCOntroller");

const router = Router();

router.route("/").put(logoutUser);

module.exports = router;
