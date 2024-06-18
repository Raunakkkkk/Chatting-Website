const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  sendMessage,
  allMessage,
} = require("../controllers/messageControllers");
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessage);
module.exports = router;
