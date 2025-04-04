const User = require("../models/user");
module.exports.signUpForm = async (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(arr);
      }
      req.flash("Success", "Welcome to Staycation!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("Error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginForm = async (req, res) => {
  // console.log("Flash messages on GET /login:", req.flash("Error"));
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("Success", "Welcome back to StayCation!");
  let url = res.locals.redirectUrl;
  if (url) {
    res.redirect(res.locals.redirectUrl);
  } else res.redirect("/listings");
};

module.exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("Success", "You are Logged Out!");
    res.redirect("/listings");
  });
};
