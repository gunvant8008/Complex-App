const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const markdown = require("marked")
const sanitizeHTML = require('sanitize-html')
// to use express in our app we need this line of code
const app = express()

let sessionOptions = session({
  secret: "JavaScript is soo cool",
  store: MongoStore.create({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
})
app.use(sessionOptions)
app.use(flash())

// by this line of code we don't need to pass session data manually for every template render
app.use(function(req, res, next) {

  // make our markdown function available from within ejs template
  // make all error and success flash messages available from all template
  res.locals.filterUserHTML = function(content) {
    return sanitizeHTML(markdown.parse(content), {allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], allowedAttributes: []})
  }
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')
  // make current user id available on the req object
  if (req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

  // make user session data available from within view templates
  res.locals.user = req.session.user
  next()
})

const router = require("./router")

app.use(express.urlencoded({ extended: false })) // accepting data by form SUBMIT METHOD
app.use(express.json()) // accepting data in json

// we are telling express to use public folder for static files
app.use(express.static("public"))
// Here first views is express option, this needs to be exactly named views, second argument is the name of folder
app.set("views", "views")
// In this line of code we need to tell express which template engine we are using to render html
app.set("view engine", "ejs")
// using router in the app
app.use("/", router)

// app.listen(3000)
module.exports = app // rather than listening, we are exporting our app
