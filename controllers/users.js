const User = require("../models/user.js");

module.exports.signupForm = (req, res) => {
    res.render("./users/signup.ejs")
}

module.exports.signupUser = async (req, res) => {
    try {

        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderHub")
            res.redirect("/listings")
        })

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }


}

module.exports.loginForm = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.loginUser = async (req, res) => {
        req.flash("success", "welcome to wanderHub  you are logged in !")
        let redirectUrl =res.locals.redirectUrl;
        if(!redirectUrl){
            return res.redirect("/listings");
        }
        res.redirect(redirectUrl);
    }

    module.exports.logoutUser =  async (req, res, next) => {
    await req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings")
    });


}