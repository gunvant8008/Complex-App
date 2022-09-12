const User = require("../models/User")

exports.mustBeLoggedIn = function(req, res, next) {
  if (req.session.user) {
    next()
    } else {
    req.flash('errors', "You must be logged in order to perform that action")
    req.session.save(function() {
      res.redirect('/')
    })
  }
}


exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      req.session.user = { avatar: user.avatar, username: user.data.username, _id: user.data._id }
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
  let user = new User(req.body) // Here we used U to differentiate a Constructor function(blueprint) from other function, it also differentiate from the variable created
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username, avatar: user.avatar, _id: user.data._id }
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error)
      })
      req.session.save(function () {
        res.redirect("/")
      })
    })
}

// here flash wll show error message once then it will remove all data from flash object from session
exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard")
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    })
  }
}
