const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");


// implementing router.route to compact routes more

// for signup routes
router.route("/signup")
.get(userController.signupForm )
.post(wrapAsync(userController.signupUser));

// for login routes
router.route("/login")
.get(userController.loginForm)
.post( saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  userController.loginUser);




// // route to get user info at signup
// router.get("/signup",userController.signupForm )

// // route to add user info from singup form to database


// router.post("/signup", wrapAsync(userController.signupUser))

// routes for user login

// router.get("/login",userController.loginForm)

// // post request to validate user in database
// router.post("/login", saveRedirectUrl,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
//   userController.loginUser)

// // creating a get route to log out user

router.get("/logout",userController.logoutUser)

module.exports = router;

