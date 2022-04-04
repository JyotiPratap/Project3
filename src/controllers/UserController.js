const usermodel = require("../models/UserModel.js");
let validator =require("email-validator");
const jwt = require("jsonwebtoken");



const isValid = function (value) {
     if (typeof value == 'undefined' || value === null) return false
     if (typeof value == 'string' && value.trim().length === 0) return false
     return true
 }
 const titleValid = function (title) {
     return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
 
 }
 // user register==========================================================
 const user = async function (req, res) {
     try {
         let userData = req.body
         if (Object.keys(userData) == 0) {
             return res.status(400).send({ status: false, msg: "please Enter the details of User" })
         }
         if (!userData.title) {
             return res.status(400).send({ status: false, msg: "title is required" })
         }
         if (!titleValid(userData.title.trim())) {
             return res.status(400).send({ status: false, msg: "please Enter valid title" })
          }
         if (!isValid(userData.name)) {
             return res.status(400).send({ status: false, msg: "name is required" })
         }
         if (!isValid(userData.mobile)) {
             return res.status(400).send({ status: false, msg: "mobile number is required" })
         }
         if (!(/^[6-9]\d{9}$/.test(userData.mobile.trim()))) {
             return res.status(400).send({ status: false, msg: "invalid mobile Number" })
         }
         let dupMobile = await usermodel.findOne({ mobile: userData.mobile})
         if (dupMobile) {
             return res.status(400).send({ status: false, msg: "this mobile Number is already registered" })
 
         }
         if (!isValid(userData.email)) {
             return res.status(400).send({ status: false, msg: "email is required" })
         }
         if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userData.email.trim()))) {
              return res.status(400).send({ status: false, msg: "invalid email id" })
          }
         let dupEmail = await usermodel.findOne({ email: userData.email })
         if (dupEmail) {
             return res.status(400).send({ status: false, msg: "this email ID is already registered" })
         }
         if (!isValid(userData.password)) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
         if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/).test(userData.password)) {
             return res.status(400).send({ status: false, msg: "password should contain at least [1,@.,a-zA] " })
 
         }
         let saveData = await usermodel.create(userData)
         let result = {
             _id: saveData._id,
             title: saveData.title,
             name: saveData.name,
             phone: saveData.phone,
             email: saveData.email,
             password: saveData.password,
             address: saveData.address,
             createdAt: saveData.createdAt,
             updatedAt: saveData.updatedAt
         }
         return res.status(201).send({ status: true, data: result })
 
     }
     catch (err) {
         return res.status(500).send({ status: false, msg: err.message })
     }
 
 };

const loginUser = async function(req,res){
     try{ let data = req.body
          if (Object.entries(data).length === 0) {
          res.status(400).send({ status: false, msg: "Kindly pass some data " })}

          let username = req.body.email
          let password = req.body.password

          if(!username){
               return res.status(400).send({status : false, msg : "Enter Valid Email"})}
          if(!password){
               return res.status(400).send({status:false,msg:"Enter valid Password"})}

          let user = await usermodel.findOne({email : username,password : password})
          if(!user){
               return res.status(400).send({status:false,msg:"credentials dont match,plz check and try again"})} 
            
          let token = jwt.sign({
               userId : user._id.toString(), exp: Math.floor(Date.now() / 1000) + (60 * 30) 
          },"Project_3")
          res.setHeader("x-api-key", token);
          res.status(200).send({status : true, data : token})

     }
     catch(error)
     {
          console.log(error)
          res.status(500).send({status: false, msg: error.message})
     }
}

  
module.exports.user=user
module.exports.loginUser=loginUser