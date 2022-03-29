const mongoose = require('mongoose');

const user = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    name: {
        required: true,
        type: String,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: [/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'please provide valid movile number'],
        trim: true
    },
    email: {
        required: true,
        unique: true,
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 15
    },
    address: {

        street: {
            type: String
        },
        city: {
            type: String
        },
        pincode: {
            type: String,
            validate:[/^[0-9]{6}$/,"please enter the six digit pincode in number form like this 123456"]
        }
    },

}, { timestamps: true });

module.exports = mongoose.model('UserModel', user) 