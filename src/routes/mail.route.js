const { Router } = require("express");
const router = Router();
const { auth } = require("../controllers/auth.control")
const { sendMail, deliverMail, syncMail } = require("../controllers/mail.control");

router.post("/mail", auth, sendMail);
router.get("/mail", auth, deliverMail);
router.patch("/mail", auth, syncMail)

module.exports = router;
