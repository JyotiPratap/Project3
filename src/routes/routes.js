const express = require('express');
const router = express.Router();
const ProjectController= require("../controllers/UserController")
const ProjectMiddleware= require("../Middleware/middleware")

router.post("/register",ProjectController.user)
router.post("/login",ProjectController.loginUser)

module.exports = router;
