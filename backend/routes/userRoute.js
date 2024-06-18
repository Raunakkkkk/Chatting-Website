const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers); //get vala will only run for logged in users
//this is used for chaining multiple routes

router.post("/login", authUser);

module.exports = router;
