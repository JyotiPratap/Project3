const bookmodel = require("../models/BookModel.js");
const objectId = require('mongoose').Types.ObjectId
const reviewmodel = require("../models/ReviewModel.js")
const usermodel = require("../models/UserModel.js")
const moment = require("moment")

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0)
     return false
    return true
}

const createbook = async function (req, res) {
    try {
        let bookData = req.body

        if (Object.keys(bookData) == 0) {
            return res.status(400).send({ status: false, msg: "bookDetails is required " })
        }
        if (!isValid(bookData.title)) {
            return res.status(400).send({ status: false, msg: "required title " })

        }
        let dupTitle = await bookmodel.findOne({ title: bookData.title })
        if (dupTitle) {
            return res.status(400).send({ status: false, msg: "this title is already register" })
        }
        if (!isValid(bookData.excerpt)) {
            return res.status(400).send({ status: false, msg: "required excerpt" })

        }
        if (!isValid(bookData.userId)) {
            return res.status(400).send({ status: false, msg: "userId required" })
        }
        if (!objectId.isValid(bookData.userId)) {
            return res.status(400).send({ status: false, msg: "userId is invalid " })
        }

        if (!isValid(bookData.ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN required" })
        }
        let dupIsbn = await bookmodel.findOne({ ISBN: bookData.ISBN })
        if (dupIsbn) {
            return res.status(400).send({ status: false, msg: "please fill unique ISBN" })
        }
        if (!isValid(bookData.category)) {
            return res.status(400).send({ status: false, msg: "category required" })
        }
        if (!isValid(bookData.subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory required" })
        }
        if (!isValid(bookData.releasedAt)) {
            return res.status(400).send({ status: false, msg: "released date required" })
        }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(bookData.releasedAt)) {
            return res.status(400).send({ status: false, msg: "this date format /YYYY-MM-DD/ Accepted" })
        }

        let data = await bookmodel.create(bookData)
        let result = {
            _id: data._id,
            title: data.title,
            excerpt: data.excerpt,
            userId: data.userId,
            ISBN: data.ISBN,
            category: data.category,
            subcategory: data.subcategory,
            deleted: data.isDeleted,
            reviews: data.reviews,
            deletedAt: data.deletedAt,
            releasedAt: data.releasedAt,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
        return res.status(201).send({ status: true, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};

const booklist = async function (req, res) {
    try {
        const queryParams = req.query
        const filterConditions = { isDeleted: false }

        if (isValid(queryParams)) {
            const { userId, category, subcategory } = queryParams

            if (isValid(userId) && !isValid(userId)) {
                const userById = await usermodel.findById(userId)
                if (!isValid(userId)) {
                    return res.status(400).send({ status: false, msg: "invalid userId" })
                }
                if (userById) {
                    filterConditions['userId'] = userId
                }
            }

            if (isValid(category)) {
                filterConditions['category'] = category.trim()
            }

            if (isValid(subcategory)) {
                filterConditions['subcategory'] = subcategory.trim()
            }
            const bookListAfterFiltration = await bookmodel.find(filterConditions).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

            if (bookListAfterFiltration.length == 0) {
                return res.status(404).send({ status: false, message: "no books found" })
            }

            res.status(200).send({ status: true, message: "filtered Book list is here", bookList: bookListAfterFiltration })

        } else {
            const bookList = await bookmodel.find(filterConditions).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })

            if (bookList.length == 0) {
                return res.status(404).send({ status: false, message: "no books found" })
            }

            res.status(200).send({ status: true, message: "Book list is here", bookList: bookList })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
};
//books review list ==========================================================================================================
const getBookReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!isValid(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "bookId required" })

        }
        let reviewList = await bookmodel.findOne({ bookId: bookId })
        if (!reviewList) {
            return res.status(404).send({ status: false, msg: "not found " })
        }
        if (!objectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId invalid" })
        }
        let result = {
            _id: reviewList._id,
            title: reviewList.title,
            excerpt: reviewList.excerpt,
            userId: reviewList.userId,
            category: reviewList.category,
            subcategory: reviewList.subcategory,
            deleted: reviewList.isDeleted,
            reviews: reviewList.reviews,
            deletedAt: reviewList.deletedAt,
            releasedAt: reviewList.releasedAt,
            createdAt: reviewList.createdAt,
            updatedAt: reviewList.updatedAt
        }
        let eachReview = await reviewmodel.find({ bookId: bookId }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        if (!eachReview) {
            result['reviewsData'] = "No review for this books"
            return res.status(200).send({ status: false, data: result })
        }
        result['reviewsData'] = eachReview
        return res.status(200).send({ status: false, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};

//update book =================================================================
const updatebook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body

       if(!isValid(data.title)){
          return res.status(400).send({status:false,msg:"title is required"})
       }
       if(!isValid(data.excerpt)){
        return res.status(400).send({status:false,msg:"excerpt is required"})
     }
     if(!isValid(data.ISBN)){
        return res.status(400).send({status:false,msg:"ISBN is required"})
     }

        let dupBook = await bookmodel.findOne({ title: data.title, ISBN: data.ISBN })
        if (dupBook) {
            return res.status(400).send({ status: false, msg: "this title and ISBN already updated" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }
        if (!objectId.isValid(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        if(!isValid(data.releasedAt)){
            return res.status(400).send({status:false,msg:"releasedAt is required"})
         }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(data.releasedAt)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })

        }
        let updateBookData = { title: data.title, excerpt: data.excerpt, releasedAt: data.releasedAt, ISBN: data.ISBN }
        let updated = await bookmodel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updateBookData }, { new: true })
        if (!updated) {
            return res.status(404).send({ status: false, msg: "data not found " })
        }
        return res.status(200).send({ status: true, data: updated })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};

// delete book data ==================================================================
const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "required bookId" })
        }
        if (!objectId.isValid(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        let bookIdNotExist = await bookmodel.findOne({ _id: bookId })
        if (!bookIdNotExist) {
            return res.status(404).send({ status: false, msg: "not found" })
        }
        if (bookIdNotExist.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "This bookId already deleted" })

        }

        let data = { isDeleted: true, deletedAt: moment() }
        const deleteData = await bookmodel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: data }, { new: true })
        let result = {
            _id: deleteData._id,
            title: deleteData.title,
            excerpt: deleteData.excerpt,
            userId: deleteData.userId,
            category: deleteData.category,
            subcategory: deleteData.subcategory,
            deleted: deleteData.isDeleted,
            reviews: deleteData.reviews,
            deletedAt: deleteData.deletedAt,
            releasedAt: deleteData.releasedAt,
            createdAt: deleteData.createdAt,
            updatedAt: deleteData.updatedAt

        }
        return res.status(200).send({ status: false, data: result })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};




module.exports.createbook = createbook
module.exports.booklist = booklist
module.exports.getBookReview = getBookReview
module.exports.updatebook = updatebook
module.exports.deleteBook = deleteBook