const express = require("express")
const router = express.Router()

// requiring the userController
const userController = require("./controllers/userController")
// by doing this we are creaing a mini exprss file and deligating some of the work(routing work) of express to router

router.get("/", userController.home)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)

module.exports = router
