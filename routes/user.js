const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { signUpForm, signUp, loginForm, login, logout } = require("../controllers/user");

// SignUp
router.get("/signup", wrapAsync(signUpForm));

router.post("/signup", wrapAsync(signUp));

// Login
router.get("/login", wrapAsync(loginForm));

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: { type: "Error" },
  }),
  wrapAsync(login)
);

// Logout
router.get("/logout", wrapAsync(logout));

module.exports = router;
