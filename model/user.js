let mongoose = require('mongoose');

let User = mongoose.Schema
(
    {
        firstName: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'first name is required'
        },
        lastName: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'second name is required'
        },
        username: 
        {
            type: String,
            default: '',
            trim: true,
            unique:true,
            required: 'username is required'
        },
        password: 
        {
            type: String,
            default: '',
            trim: true,
            required: 'password is required'
        },
       email: 
       {
            type: String,
            default: '',
            trim: true,
            unique:true,
            required: 'email address is required'
       },
       contact: 
       {
            type: Number,
            default: '',
            trim: true,
            required: 'contact number is required'
       },
       userType: 
       {
            type: String,
            default: '',
            trim: true,
            required: 'User type is required'
       },
       created: 
       {
            type: Date,
            default: Date.now
       },
       updated: 
       {
            type: Date,
            default: Date.now
       }
    },
    {
        collection: "users"
    }
);

module.exports.User = mongoose.model('User', User);