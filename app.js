const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const markdown = require("marked")
const csrf = require('csurf')
// to use express in our app we need this line of code
const app = express()
const sanitizeHTML = require('sanitize-html')



app.use(express.urlencoded({ extended: false })) // accepting data by form SUBMIT METHOD
app.use(express.json()) // accepting data in json

app.use('/api', require('./router-api'))


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

// we are telling express to use public folder for static files
app.use(express.static("public"))
// Here first views is express option, this needs to be exactly named views, second argument is the name of folder
app.set("views", "views")
// In this line of code we need to tell express which template engine we are using to render html
app.set("view engine", "ejs")


app.use(csrf())

app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})


// using router in the app
app.use("/", router)

app.use(function(err, req, res, next) {
  if(err) {
    if (err.code == "EBADCSRFTOKEN") {
      req.flash('errors', "Cross site request forgery detected.")
      req.session.save(() => res.redirect('/'))
    } else {
      res.render('404')
    }
  }
})

const server = require('http').createServer(app)
const io = require('socket.io') (server)

io.use(function(socket, next) {
  sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket) {
  if (socket.request.session.user) {
    let user = socket.request.session.user

    socket.emit('welcome', {username: user.username, avatar: user.avatar})

    socket.on('chatMessageFromBrowser', function(data) {
    socket.broadcast.emit('chatMessageFromServer', {message: sanitizeHTML(data.message, {allowedTags: [], allowedAttributes: {}}), username: user.username, avatar: user.avatar})
    })
  }
})

// app.listen(3000)
module.exports = server // rather than listening, we are exporting our app, then to add chat functionality we changed it to server
