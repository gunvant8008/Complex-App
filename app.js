const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
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

const router = require("./router")

app.use(express.urlencoded({ extended: false })) // accepting data by form SUBMIT METHOD
app.use(express.json()) // accepting data in json

// we are telling express to use public foler for static files
app.use(express.static("public"))
// Here first views is express option, this needs to be exactly named views, second argument is the name of folder
app.set("views", "views")
// In this line of code we need to tell express which templating engine we are using to render html
app.set("view engine", "ejs")
// using router in the app
app.use("/", router)

// app.listen(3000)
module.exports = app // rather than listening, we are exporting our app
