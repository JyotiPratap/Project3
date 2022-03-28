const bookmodel = require("../models/BookModel.js");
const objectId = require('mongoose').Types.ObjectId
const reviewmodel = require("../models/ReviewModel.js")

const isValid = function (value) {
    if (typeof value == 'undefined' || value === null) return false
    if (typeof value == 'string' && value.trim().length === 0) return false
    return true
}

const createbook = async function (req, res) {
    try {
        let bookdata = req.body
        if (Object.entries(bookdata).length === 0) {
            res.status(400).send({ status: false, msg: "Kindly pass some data " })
        }
        if (!isValid(bookdata.title)) {
            return res.status(400).send({ status: false, msg: "required title " })
        }
        let dupTitle = await bookmodel.findOne({ title: bookdata.title })
        if (dupTitle) {
            return res.status(400).send({ status: false, msg: "this title is already register" })
        }
        if (!isValid(bookdata.excerpt)) {
            return res.status(400).send({ status: false, msg: "required excerpt " })
        }
        if (!isValid(bookdata.userId)) {
            return res.status(400).send({ status: false, msg: "userId required" })
        }
        if (!objectId.isValid(bookdata.userId)) {
            return res.status(400).send({ status: false, msg: "userId is invalid " })
        }
        if (!isValid(bookdata.ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN required" })
        }
        let dupIsbn = await bookmodel.findOne({ ISBN: bookdata.ISBN })
        if (dupIsbn) {
            return res.status(400).send({ status: false, msg: "please fill unique ISBN" })
        }
        if (!isValid(bookdata.category)) {
            return res.status(400).send({ status: false, msg: "category required" })
        }
        if (!isValid(bookdata.subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory required" })
        }
        if (!isValid(bookdata.releasedAt)) {
            return res.status(400).send({ status: false, msg: "released date required" })
        }
        let book = await bookmodel.create(bookdata)
        res.status(201).send({ status: true, data: book })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }

};

const booklist = async function (req, res) {
    try {
        let { userId, category, subcategory } = req.query
        let getData = await bookmodel.find({ isDeleted: false }).select({ title:1,excerpt:1,userId:1,category:1,reviews:1, releasedAt:1})
        if (!getData) {
            return res.status(404).send({ status: false, msg: "no data found" })
                
        }
        getData['data']=getData
        
        return res.status(200).send({ status: true, message: "books list",data:getData })
        let getDataFilter = await bookmodel.find({ userId: userId, category: category, subcategory: subcategory, isDeleted: false }).select({title:1,excerpt:1,userId:1,category:1,reviews:1, releasedAt:1}).sort({ title: -1 })
        if (!getDataFilter) {
            return res.status(404).send({ status: false, msg: "no data found" })
        }
        getDataFilter['data'] = getDataFilter
        
        return res.status(200).send({ status: true, message: "books list", data:getDataFilter })

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })

    }
};

const getBookReview = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!isValid(bookId)) {
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


}


const updatebook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let { title, excerpt, ISBN } = req.body
        if (!(title && excerpt && ISBN)) {
            return res.status(400).send({ status: false, msg: "required data should be title ,excerpt,date ,ISBN" })
        }
        let dupBook = await bookmodel.findOne({ title: title, ISBN: ISBN })
        if (dupBook) {
            return res.status(400).send({ status: false, msg: "this title and ISBN already updated" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }
        if (!objectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        let date = moment()
        let updateBookData = { title: title, excerpt: excerpt, releasedAt: date, ISBN: ISBN }
        let updated = await bookmodel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updateBookData }, { new: true })
        if (!updated) {
            return res.status(404).send({ status: false, msg: "data not found " })
        }
        return res.status(200).send({ status: false, data: updated })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
};

const deleteBook = async function(req,res){
    try{
        let bookId = req.params.bookId
    if (!bookId) {
        return res.status(400).send({ status: false, msg: "required bookId" })
    }
    if (!objectId.isValid(bookId)) {
        return res.status(400).send({ status: false, msg: "invalid bookId" })
    }
    let bookIdNotExist = await bookmodel.findOne({_id:bookId})
    if (!bookIdNotExist) {
        return res.status(404).send({ status: false, msg: "not found" })
    }
    if(bookIdNotExist.isDeleted == true){
        return res.status(400).send({ status: false, msg: "This bookId already deleted" })

    }

    let data = {isDeleted:true,deletedAt:moment()}
    const deleteData = await bookmodel.findOneAndUpdate({_id:bookId,isDeleted:false},{$set:data},{new:true})
    let result ={
        _id:deleteData._id,
        title:deleteData.title,
        excerpt:deleteData.excerpt,
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
    return res.status(200).send({status:false,data:result})
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}




module.exports.createbook = createbook
module.exports.booklist=booklist
module.exports.getBookReview=getBookReview
module.exports.updatebook=updatebook
module.exports.deleteBook=deleteBook