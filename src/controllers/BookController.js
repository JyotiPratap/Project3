const bookmodel = require("../models/BookModel.js");
const objectId = require('mongoose').Types.ObjectId

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

}
module.exports.createbook = createbook
 module.exports.booklist=booklist
// module.exports.getbook=getbook