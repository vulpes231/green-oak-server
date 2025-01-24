const { Router } = require("express");
const { emailUser, sendLoginCode } = require("../controllers/mail-cont");

const router = Router();

router.route("/").post(emailUser);
router.route("/login").post(sendLoginCode);

module.exports = router;
