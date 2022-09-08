const User = require("../models/User")

exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      req.session.user = { favColor: "blue", username: user.data.username }
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch(function (e) {
      req.flash("errors", e) // will modify our session data
      req.session.save(function () {
        res.redirect("/")
      })
    })
}

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/")
  })
}

exports.register = function (req, res) {
  let user = new User(req.body) // Here we used U to differentiate a Constructor function(blueprint) from other function, it also differenciate from the variable created
  user.register()
  if (user.errors.length) {
    user.errors.forEach(function (error) {
      req.flash("regErrors", error)
    })
    req.session.save(function () {
      res.redirect("/")
    })
  } else {
    res.send("Congrats, there are no errors.")
  }
}

// here flash wll show error message once then it will remove all data from flash object from session
exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", { username: req.session.user.username })
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    })
  }
}