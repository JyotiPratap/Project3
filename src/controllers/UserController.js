const usermodel = require("../models/UserModel.js");
let validator =require("email-validator");
const jwt = require("jsonwebtoken");



const user = async function (req, res) {
    try {
         let userdata = req.body
         if (Object.entries(userdata).length === 0) {
              res.status(400).send({ status: false, msg: "Kindly pass some data " })
         }
         else {
              let title= req.body.title
              if(!title){
              return res.status(400).send({status: false,msg:"Enter title"})}
              
              let name = req.body.name
              if(!name)
              return res.status(400).send({status: false,msg:"Enter Name"})
             
              let  mobile = req.body.mobile
              if(!mobile)
              return res.status(401).send({status: false,msg:"Enter mobilenumber"})

              if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(mobile))) {
                   res.status(400).send({status : false , msg : " enter valid mobileno."})
                   return
               }
               let  email = req.body.email
               if(!email)
               return res.status(401).send({status: false,msg:"Enter emailId"})

               let check = validator.validate(email);
               if (!check) {
                    return res.status(401).send({ status: false, msg: "Enter a valid email id" }) } 
 
               let mail = await usermodel.findOne({ email })
               if (mail) {
                    return res.status(401).send({ status: false, msg: "Enter Unique Email Id." })}

               let password = req.body.password
               if(!password){
               return res.status(400).send({status: false,msg:"Enter password"})}

              let address = req.body.address
              if(!address){
              return res.status(400).send({status:false,msg:"Enter address"})}
                   
              let user = await usermodel.create(userdata)
              res.status(201).send({ status: true, data: user })
         }
    }
    catch (error) {
         console.log(error)
         res.status(500).send({ status: false, msg: error.message })
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
               userId : user._id.toString(),  
               batch: "thorium",
          },"Project_1")
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