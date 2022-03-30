const express = require('express');
const router = express.Router();
const usercontroller= require("../controllers/UserController")
const bookcontroller= require("../controllers/BookController")
const reviewcontroller= require("../controllers/ReviewController")
const ProjectMiddleware= require("../Middleware/middleware")

router.post("/register",usercontroller.user)
router.post("/login",usercontroller.loginUser)

router.post("/createbook",ProjectMiddleware.authentication,bookcontroller.createbook)
router.get("/getbook",ProjectMiddleware.authentication,bookcontroller.booklist)
router.get("/books/:bookId",ProjectMiddleware.authentication,bookcontroller.getBookReview)
router.put("/books/:bookId",ProjectMiddleware.authentication,ProjectMiddleware.authorization,bookcontroller.updatebook)
router.delete("/books/:bookId",ProjectMiddleware.authentication,ProjectMiddleware.authorization,bookcontroller.deleteBook)

router.post("/createReview/:bookId",ProjectMiddleware.authentication,reviewcontroller.createReview)
router.put("/books/:bookId/review/:reviewId",ProjectMiddleware.authentication,ProjectMiddleware.authorization,reviewcontroller.reviewUpdate)
router.delete('/books/:bookId/review/:reviewId',ProjectMiddleware.authentication,ProjectMiddleware.authorization,reviewcontroller.reviewDelete)

module.exports = router;
