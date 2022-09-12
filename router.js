const express = require("express")
const { route } = require("./app")
const router = express.Router()
// requiring the userController
const userController = require("./controllers/userController")
// by doing this we are creating a mini express file and delegating some of the work(routing work) of express to router
const postController = require('./controllers/postController')


// user related routes
router.get("/", userController.home)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)

// post related routes
router.get('/create-post',userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-post', userController.mustBeLoggedIn, postController.create )
router.get('/post/:id', postController.viewSingle )

module.exports = router
